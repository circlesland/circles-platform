import BN from "omo-quirks/dist/BN";
import {OmoEvent} from "omo-events/dist/omoEvent";

export interface CirclesTransaction extends OmoEvent
{
  cached?: boolean,
  id: string,
  token: string,
  tokenOwner?: string,
  blockNo: number,
  timestamp?: number,
  direction: "in" | "out",
  subject: string,
  from: string,
  to: string,
  amount: BN,
}
