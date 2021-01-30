import {BlockchainEvent} from "omo-events/dist/blockchainEvent";

export interface TrustRelation extends BlockchainEvent {
    from: string
    to: string
    limit: number
}
