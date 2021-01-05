import {Address} from "../interfaces/address";
import {CirclesProfile} from "./circlesProfile";
import {Profile} from "../../o-fission/entities/profile";
import {Entity} from "../../o-fission/entities/entity";

export interface Contact extends Entity
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
