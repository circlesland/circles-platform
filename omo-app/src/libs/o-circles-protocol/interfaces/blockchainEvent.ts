import type { BN } from "ethereumjs-util";
import type { ByteString } from "./byteString";
import type { Address } from "./address";
import {OmoEvent} from "../../o-events/omoEvent";
import {OmoEventTypes} from "../../o-events/eventTypes";

export interface SystemEvent extends OmoEvent {
}

export abstract class Signal implements SystemEvent
{
  readonly key: string;
  type: OmoEventTypes;
}

export class BeginSignal implements Signal
{
  readonly key: string;
  type: "shell.begin" = "shell.begin";

  constructor(key:string)
  {
    this.key = key;
  }
}

export class ProgressSignal implements Signal
{
  readonly key: string;
  type: "shell.progress" = "shell.progress";

  message:string;
  percent:number;

  constructor(key:string, message: string, percent: number)
  {
    this.key = key;
    this.message = message;
    this.percent = percent;
  }
}

export class EndSignal implements Signal
{
  readonly key: string;
  type: "shell.done" = "shell.done";

  constructor(key:string)
  {
    this.key = key;
  }
}

export interface BlockchainEvent extends SystemEvent {
  cached?:boolean,
  event: string;
  blockNumber: BN
  blockHash: ByteString
  address: Address
  returnValues: { [key: string]: any }
}
