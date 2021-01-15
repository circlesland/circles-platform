import {Address} from "../interfaces/address";
import {BN} from "ethereumjs-util";
import {SystemEvent} from "../interfaces/blockchainEvent";

export interface CirclesTransaction extends SystemEvent
{
  cached?: boolean,
  id: string,
  token: Address,
  tokenOwner?: Address,
  blockNo: number,
  timestamp?: number,
  direction: "in" | "out",
  subject: string,
  from: Address,
  to: Address,
  amount: BN,
}
