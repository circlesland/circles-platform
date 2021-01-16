import {CirclesProfile} from "../circles/circlesProfile";
import {Profile} from "./profile";

export interface Contact
{
  circlesProfile?: CirclesProfile,
  omoProfile: {
    profile:Profile,
    avatarCid?: string
  },
  safeAddress: string,
  lastBlockNo: number,
  trust: {
    in?: number,
    out?: number
  }
}
