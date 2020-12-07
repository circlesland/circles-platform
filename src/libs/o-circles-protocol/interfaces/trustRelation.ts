import type { Address } from "./address";
import type { Event } from "./event";

export interface TrustRelation extends Event {
  from: Address
  to: Address
  limit: number
}
