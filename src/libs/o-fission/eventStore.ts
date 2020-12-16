import {EventQuery} from "../o-circles-protocol/eventQuery";
import {Event} from "../o-circles-protocol/interfaces/event";
import {Subscription} from "rxjs";
import FileSystem from "webnative/fs/filesystem";
import {BN} from "ethereumjs-util";
import {Directory, DirectoryChangeType} from "./directories/directory";
import {CacheEvent, CacheEventGroup} from "./entities/cacheEvent";

export class EventStore<TEntity extends CacheEvent>
  extends Directory<CacheEventGroup>
{
  private static readonly blocksPerDay = 17280;

  private readonly _eventSources:{
    [name:string]: {
      source: EventQuery<Event>,
      subscription: Subscription,
      factory: (eventStore:EventStore<TEntity>, source:string, event:Event) => TEntity
    }} = {};

  private _buffer: {
    firstBlockNo: number,
    lastBlockNo: number,
    events: CacheEvent[]
  } = {
    firstBlockNo: 0,
    lastBlockNo: 0,
    events: []
  };

  constructor(fs:FileSystem, pathParts:string[], entityFactory:(data:string) => CacheEventGroup)
  {
    super(fs, pathParts, entityFactory);
  }

  attachEventSource(
    name:string,
    source:EventQuery<Event>,
    factory: (eventStore:EventStore<TEntity>, source:string, event:Event) => TEntity|null|undefined)
  {
    const self = this;
    const subscription = source.events.subscribe(
      event => this.onEvent(name, factory, self, event));

    this._eventSources[name] = {
      source,
      subscription,
      factory
    };

    source.execute();
  }

  removeEventSource(name:string)
  {
    const eventSource = this._eventSources[name];
    if (!name)
      throw new Error("There is no event source with the name " + name);

    eventSource.subscription.unsubscribe();
    delete this._eventSources[name];
  }

  async clearBuffer()
  {
    this._buffer = {
      firstBlockNo: 0,
      lastBlockNo: 0,
      events: []
    };
  }

  hashString(str:string) {
    let hash = 0;
    if (str.length == 0) {
      return hash;
    }
    for (var i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  async flush() : Promise<string>
  {
    const startGroup = Math.floor(this._buffer.firstBlockNo / EventStore.blocksPerDay);
    const endGroup = Math.floor(this._buffer.lastBlockNo / EventStore.blocksPerDay);

    // First load all existing data in the range of the buffered events
    // and feed the existing data to the buffer.
    for (let i = startGroup; i <= endGroup; i++)
    {
      // Every group corresponds to one day.
      const groupName = "day_" + i.toString();

      // If a group already exists simply copy the existing data
      // to the buffer before committing it.
      if (await this.exists([groupName]))
      {
        const existingData = await this.tryGetByName(groupName);
        console.log("Merging with existing data: ", existingData);

        for (const blockNo in existingData.events)
        {
          const blockEvents = existingData.events[blockNo];
          if (!blockEvents)
            continue;

          blockEvents.forEach(existingEvent => {
            this._buffer.events.push(existingEvent);
          });
        }
      }
    }

    // Then group all events in daily packages sorted by blockNo desc
    const groups:{
      [group:string]: {
        events: {
          [blockNo:number]: CacheEvent[]
        }
      }
    } = {};

    for (const event of this._buffer.events)
    {
      const groupIdx = "day_" + Math.floor(event.blockNo / EventStore.blocksPerDay).toString();
      const group = groups[groupIdx]
        ? groups[groupIdx]
        : {
          name: groupIdx,
          events:{}
        };
      groups[groupIdx] = group;

      const events = group.events[event.blockNo]
        ? group.events[event.blockNo]
        : [];

      events.push(event);
      group.events[event.blockNo] = events;
    }

    for (const groupKey in groups)
    {
      for (const blockNo in groups[groupKey].events)
      {
        groups[groupKey].events[blockNo].sort(
          (a,b) => a.blockNo < b.blockNo ? 1 : a.blockNo > b.blockNo ? -1 : 0);

        const distinctEvents = groups[groupKey].events[blockNo].reduce((p, c) => {
          p[this.hashString(JSON.stringify(c))] = c;
          return p;
        },{});

        const distinctEventsArray = Object.keys(distinctEvents)
          .map(key => distinctEvents[key]);

        groups[groupKey].events[blockNo] = distinctEventsArray;
      }

      console.log("Saving group " + groupKey + " to fission drive: ", {
        name: groupKey,
        events: groups[groupKey].events
      });

      await this.addOrUpdate({
        name: groupKey,
        events: groups[groupKey].events
      }, false, "flush");
    }

    return await this.publish();
  }

  protected async onEvent(
    source:string,
    factory: (eventStore: EventStore<TEntity>, source: string, event: Event) => (TEntity | null | undefined),
    self: EventStore<TEntity>,
    event: Event)
  {
    const entity = factory(self, source, event);
    if (!entity)
    {
      return;
    }

    if (this._buffer.firstBlockNo == 0)
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

  async maintainIndexes(change: DirectoryChangeType, entity: CacheEventGroup, indexHint: string | undefined): Promise<void>
  {
  }

  async loadAllToCache(fromBlock:number, toBlock:number)
  {
    const allDays = await this.listNames();
    const fromDay = fromBlock / EventStore.blocksPerDay;
    const toDay = fromBlock / EventStore.blocksPerDay;

    const daysInWindow = allDays.map(o => parseInt(o)).filter(day => day >= fromDay && day <= toDay);
    for (const day of daysInWindow)
    {
      const cachedEvents = await this.tryGetByName(day.toString());
      for (const blockNo in cachedEvents)
      {
        cachedEvents.events[blockNo].forEach(event =>
        {

        });
      }
    }
  }
}
