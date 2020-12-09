import FileSystem from "webnative/fs/filesystem";
import {AggregateSet} from "../entities/aggregateSet";
import {Directory, DirectoryChangeType} from "../directory";
import {Flushable} from "../flushable";

export class Aggregates extends Directory<AggregateSet> implements Flushable
{
  private _buffer:{[setName:string]:AggregateSet} = {};

  constructor(fs: FileSystem)
  {
    super(fs, ["aggregates"], json => <AggregateSet>JSON.parse(json));
  }

  async tryGetValue(aggregateSet:string, key:string)
    : Promise<{ lastBlockNo:number, value:any }|null|undefined>
  {
    const set = this._buffer[aggregateSet]
    ? this._buffer[aggregateSet]
      : await this.tryGetByName(aggregateSet);

    if (!set) {
      return null;
    }

    this._buffer[aggregateSet] = set;
    return set[key];
  }

  async setValue(aggregateSet:string, key:string, lastBlockNo:number, value:any)
    : Promise<{ lastBlockNo:number, value:any }|null|undefined>
  {
    let set = this._buffer[aggregateSet]
      ? this._buffer[aggregateSet]
      : await this.tryGetByName(aggregateSet);

    if (!set)
    {
      set = {
        name: aggregateSet,
        lastBlockNo: lastBlockNo,
        values: {}
      };
    }

    set.values[key] = value;
    this._buffer[aggregateSet] = set;

    return {
      lastBlockNo: lastBlockNo,
      value: value
    };
  }

  async clearBuffer()
  {
    this._buffer = {};
  }

  async flush()
  {
    for (const key in this._buffer)
    {
      const set = this._buffer[key];
      await this.addOrUpdate({
        lastBlockNo: set.lastBlockNo,
        name: set.name,
        values: set.values
      }, false, "flush");
    }

    return await this.publish();
  }

  async maintainIndexes(change: DirectoryChangeType, entity: AggregateSet, indexHint?: string): Promise<void>
  {
  }
}
