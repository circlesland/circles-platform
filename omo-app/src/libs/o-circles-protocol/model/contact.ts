import {Address} from "../interfaces/address";
import {CirclesProfile} from "./circlesProfile";
import {Profile} from "../../o-fission/entities/profile";

export interface Contact
{
  circlesProfile?: CirclesProfile,
  omoProfile: {
    profile:Profile,
    avatar?: string
  },
  safeAddress: Address,
  lastBlockNo: number,
  trust: {
    in?: number,
    out?: number
  }
}
