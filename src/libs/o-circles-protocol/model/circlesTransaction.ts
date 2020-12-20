import {Address} from "../interfaces/address";
import {BN} from "ethereumjs-util";

export interface CirclesTransaction
{
  id: string,
  token: Address,
  tokenOwner: Address,
  blockNo: number,
  timestamp: Date,
  direction: "in" | "out",
  subject: string,
  from: Address,
  to: Address,
  amount: BN,
}
