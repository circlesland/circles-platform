import { Entity } from "./entity";
import {CirclesTransaction} from "../../o-circles-protocol/model/circlesTransaction";

export interface Blocks extends Entity {
  entries: {
    [blockNo:number]: {
      timestamp: number,
      transactions: CirclesTransaction[]
    }
  }
}
