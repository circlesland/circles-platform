import { Entity } from "./entity";
import {Token} from "./token";
import {Contact} from "../../o-circles-protocol/model/contact";

export interface CachedContacts extends Entity {
  entries: {
    [safeAddress:string]: Contact
  }
}
