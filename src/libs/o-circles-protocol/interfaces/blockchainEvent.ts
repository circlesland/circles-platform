import type { BN } from "ethereumjs-util";
import type { ByteString } from "./byteString";
import type { Address } from "./address";

export interface SystemEvent {

}

export abstract class Signal implements SystemEvent
{
  readonly key: string;
}

export class BeginSignal implements Signal
{
  readonly key: string;

  constructor(key:string)
  {
    this.key = key;
  }
}

export class DoneSignal implements Signal
{
  readonly key: string;

  constructor(key:string)
  {
    this.key = key;
  }
}

export interface BlockchainEvent extends SystemEvent {
  event: string;
  blockNumber: BN
  blockHash: ByteString
  address: Address
  returnValues: { [key: string]: any }
}
