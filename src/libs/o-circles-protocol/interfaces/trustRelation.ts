import type { Address } from "./address";
import type { BlockchainEvent } from "./blockchainEvent";

export interface TrustRelation extends BlockchainEvent {
  from: Address
  to: Address
  limit: number
}
