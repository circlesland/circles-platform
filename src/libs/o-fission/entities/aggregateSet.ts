import {Entity} from "./entity";

export interface AggregateSet extends Entity {
  lastBlockNo: number,
  values: {
    [key:string]:any
  }
}
