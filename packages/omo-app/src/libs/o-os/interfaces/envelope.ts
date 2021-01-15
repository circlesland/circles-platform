import {Signal} from "../../o-circles-protocol/interfaces/blockchainEvent";

export interface Envelope<TContent>
{
  signal?:Signal,
  payload?:TContent
}
