import { Entity } from "./entity";
import {CirclesTransaction} from "../../o-circles-protocol/model/circlesTransaction";

export interface CachedTransactions extends Entity {
  entries: {
    [blockNo:number]: {
      timestamp: number,
      transactions: CirclesTransaction[]
    }
  }
}
