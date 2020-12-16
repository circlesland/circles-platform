import {EventQuery} from "../o-circles-protocol/eventQuery";
import {Event} from "../o-circles-protocol/interfaces/event";
import {Subscription} from "rxjs";
import FileSystem from "webnative/fs/filesystem";
import {BN} from "ethereumjs-util";
import {Directory, DirectoryChangeType} from "./directories/directory";
import {CacheEvent, CacheEventGroup} from "./entities/cacheEvent";

export type CacheEventGroups = {
  [day:string]: CacheEventGroup
}

/**
 * This Directory implementation can be used to cache blockchain events.
 * It groups the events by day and keeps one file per day in the directory.
 *
 * Incoming events are buffered before they're written.
 * To write the buffered events to the fs, call flush().
 */
export class EventStore
  extends Directory<CacheEventGroup>
{
  // Assuming one new block per 5 seconds:
  private static readonly blocksPerDay = 17280;

  private readonly _eventSources: {
    [name: string]: {
      source: EventQuery<Event>,
      subscription: Subscription
    }
  } = {};

  private _buffer: {
    firstBlockNo: number,
    lastBlockNo: number,
    events: CacheEvent[]
  } = {
    firstBlockNo: Number.MAX_SAFE_INTEGER,
    lastBlockNo: Number.MIN_SAFE_INTEGER,
    events: []
  };

  constructor(fs: FileSystem, pathParts: string[])
  {
    super(fs, pathParts);
  }

  /**
   * Attaches a new event source to the directory.
   * All events that appear on this source will be buffered.
   * @param name
   * @param source
   * @param factory
   */
  async attachEventSource(
    name: string,
    source: EventQuery<Event>)
  {
    const self = this;
    const subscription = source.events.subscribe(
      event => this.onEvent(name, self, event));

    this._eventSources[name] = {
      source,
      subscription
    };

    await source.execute();
  }

  /**
   * Unsubscribes from an event source.
   * @param name
   */
  detachEventSource(name: string)
  {
    const eventSource = this._eventSources[name];
    if (!name)
      throw new Error("There is no event source with the name " + name);

    eventSource.subscription.unsubscribe();
    delete this._eventSources[name];
  }

  /**
   * Writes all entries in the buffer to the FS.
   * This method leaves the buffer intact, to clear it use clearBuffer()
   */
  async flush(): Promise<string>
  {
    const startDay = Math.floor(this._buffer.firstBlockNo / EventStore.blocksPerDay);
    const endDay = Math.floor(this._buffer.lastBlockNo / EventStore.blocksPerDay);

    // Load all events in that range from the FS to the buffer
    await this.loadEventsFromFsToBuffer(startDay, endDay);

    // Then group, sort and deduplicate all events
    let days = this.bufferToDailyGroups();
    days = this.orderAndDeduplicateDailyGroups(days);

    // Finally write them back to the fs.
    return await this.writeDailyGroupsToFs(days);
  }

  clearBuffer()
  {
    this._buffer = {
      firstBlockNo: 0,
      lastBlockNo: 0,
      events: []
    };
  }

  /**
   * Loads stored events for the given time span and returns an array of CacheEvents.
   * @param fromDay
   * @param toDay
   */
  async loadEventsFromFs(fromDay: number, toDay: number) : Promise<CacheEvent[]>
  {
    if (fromDay > toDay)
    {
      throw new Error(`The fromDay (${fromDay}) is larger than the toDay (${toDay})`);
    }
    if (fromDay < 0 || toDay < 0)
    {
      throw new Error(`The fromDay (${fromDay}) or toDay (${toDay}) is smaller than zero`);
    }

    let allEvents:CacheEvent[] = [];

    for (let i = fromDay; i <= toDay; i++)
    {
      // Every group corresponds to one day.
      const groupName = "day_" + i.toString();

      if (!(await this.exists([groupName])))
      {
        continue;
      }

      const existingData = await this.tryGetByName(groupName);
      for (const blockNo in existingData.events)
      {
        const blockEvents = existingData.events[blockNo];
        if (!blockEvents)
          continue;

        allEvents = allEvents.concat(blockEvents);
      }
    }

    return allEvents;
  }

  /**
   * Loads stored events from the filesystem to the in-memory buffer.
   * @param fromDay
   * @param toDay
   */
  private async loadEventsFromFsToBuffer(fromDay: number, toDay: number)
  {
    const storedEvents = await this.loadEventsFromFs(fromDay, toDay);
    storedEvents.forEach(existingEvent =>
    {
      if (existingEvent.blockNo < this._buffer.firstBlockNo)
      {
        this._buffer.firstBlockNo = Math.floor(existingEvent.blockNo / EventStore.blocksPerDay) * EventStore.blocksPerDay;
      }

      if (existingEvent.blockNo > this._buffer.lastBlockNo)
      {
        this._buffer.lastBlockNo = (Math.ceil(existingEvent.blockNo / EventStore.blocksPerDay) * EventStore.blocksPerDay) - 1;
      }

      this._buffer.events.push(existingEvent);
    });
  }

  /**
   * Writes incoming events to the in-memory buffer.
   * @param source
   * @param factory
   * @param self
   * @param event
   * @protected
   */
  protected async onEvent(
    source: string,
    self: EventStore,
    event: Event)
  {
    // Events from event attached event sources always originate from contracts.
    // The value and recipient fields stay empty, they're only used for transactions.
    const entity:CacheEvent = {
      blockNo: event.blockNumber.toNumber(),
      source: source,
      data: JSON.stringify(event.returnValues),
      blockHash: event.blockHash,
      senderType: "contract",
      senderRef: event.address,
      eventType: event.event,
      valueInWei: undefined,
      recipientRef: undefined,
      recipientType: undefined,
      transactionHash: undefined
    };

    if (event.blockNumber.lt(new BN(this._buffer.firstBlockNo.toString())))
    {
      this._buffer.firstBlockNo = Math.floor(event.blockNumber.toNumber() / EventStore.blocksPerDay) * EventStore.blocksPerDay;
    }

    if (new BN(event.blockNumber).gt(new BN(this._buffer.lastBlockNo.toString())))
    {
      this._buffer.lastBlockNo = (Math.ceil(event.blockNumber.toNumber() / EventStore.blocksPerDay) * EventStore.blocksPerDay) - 1;
    }

    this._buffer.events.push(entity);

    console.log("Buffered new event from block: " + event.blockNumber.toNumber() + ":", entity);
    console.log("Current buffer dimensions:     " + this._buffer.firstBlockNo + " -> " + this._buffer.lastBlockNo);
    console.log("Current buffer item count:     " + this._buffer.events.length);
    console.log("Current buffer fill factor:    " + (this._buffer.events.length / (this._buffer.lastBlockNo - this._buffer.firstBlockNo)).toFixed(2));
  }

  /**
   * A ts implementation of java's String.hashCode() method.
   * @param str
   */
  private hashString(str: string)
  {
    let hash = 0;
    if (str.length == 0)
    {
      return hash;
    }
    for (var i = 0; i < str.length; i++)
    {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  /**
   * Groups all events per day and sorts the list within that group by block no. DESC.
   */
  private bufferToDailyGroups(): CacheEventGroups
  {
    const days: CacheEventGroups = {};

    for (const event of this._buffer.events)
    {
      const dayIdx = "day_" + Math.floor(event.blockNo / EventStore.blocksPerDay).toString();

      // Get or create day group
      const day = days[dayIdx]
        ? days[dayIdx]
        : {
          name: dayIdx,
          events: {}
        };

      // Get the group for the blockNo on this day or create one
      const eventsOfDay = day.events[event.blockNo]
        ? day.events[event.blockNo]
        : [];

      // Add the event to the day->block group
      eventsOfDay.push(event);
      day.events[event.blockNo] = eventsOfDay;

      // Update the group
      days[dayIdx] = day;
    }

    return days;
  }

  private orderAndDeduplicateDailyGroups(days: CacheEventGroups) : CacheEventGroups
  {
    for (const dayIdx in days)
    {
      for (const blockNo in days[dayIdx].events)
      {
        days[dayIdx].events[blockNo].sort(
          (a, b) => a.blockNo < b.blockNo ? 1 : a.blockNo > b.blockNo ? -1 : 0);

        const distinctEvents = days[dayIdx].events[blockNo].reduce((p, c) =>
        {
          p[this.hashString(JSON.stringify(c))] = c;
          return p;
        }, {});

        const distinctEventsArray = Object.keys(distinctEvents)
          .map(key => distinctEvents[key]);

        days[dayIdx].events[blockNo] = distinctEventsArray;
      }
    }

    return days;
  }

  private async writeDailyGroupsToFs(days: CacheEventGroups)
  {
    for (const dayIdx in days)
    {
      for (const blockNo in days[dayIdx].events)
      {
        console.log("Saving group " + dayIdx + " to fission drive: ", {
          name: dayIdx,
          events: days[dayIdx].events
        });

        await this.addOrUpdate({
          name: dayIdx,
          events: days[dayIdx].events
        }, false, "flush");
      }
    }

    return await this.publish();
  }

  async maintainIndexes(change: DirectoryChangeType, entity: CacheEventGroup, indexHint: string | undefined): Promise<void>
  {
  }
}
