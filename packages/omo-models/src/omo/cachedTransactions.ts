import { Entity } from "./entity";
import {CirclesTransaction} from "../circles/circlesTransaction";

export interface CachedTransactions extends Entity {
  entries: {
    [blockNo:number]: {
      timestamp: number,
      transactions: CirclesTransaction[]
    }
  }
}
