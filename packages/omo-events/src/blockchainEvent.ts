import {OmoEvent} from "./omoEvent";

export interface BlockchainEvent extends OmoEvent
{
    cached?:boolean;
    event: string;
    blockNumber: number;
    blockHash: string;
    address: string;
    returnValues: { [key: string]: any };
}
