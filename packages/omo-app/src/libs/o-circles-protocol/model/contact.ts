import {Address} from "../interfaces/address";
import {CirclesProfile} from "./circlesProfile";
import {Profile} from "../../o-fission/entities/profile";
import {Entity} from "../../o-fission/entities/entity";

export interface Contact
{
  circlesProfile?: CirclesProfile,
  omoProfile: {
    profile:Profile,
    avatarCid?: string
  },
  safeAddress: Address,
  lastBlockNo: number,
  trust: {
    in?: number,
    out?: number
  }
}
