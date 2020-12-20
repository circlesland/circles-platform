import {Address} from "../interfaces/address";
import {CirclesProfile} from "./circlesProfile";

export interface Contact
{
  circlesProfile?: CirclesProfile,
  safeAddress: Address,
  lastBlockNo: number,
  trust: {
    in?: number,
    out?: number
  }
}
