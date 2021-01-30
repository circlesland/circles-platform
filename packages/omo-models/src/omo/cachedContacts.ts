import { Entity } from "./entity";
import {Contact} from "./contact";

export interface CachedContacts extends Entity {
  entries: {
    [safeAddress:string]: Contact
  }
}
