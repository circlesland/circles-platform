import type { BN } from "ethereumjs-util";
import type { ByteString } from "./byteString";
import type { Address } from "./address";

export interface Event {
  event: string;
  blockNumber: BN
  blockHash: ByteString
  address: Address
  returnValues: { [key: string]: any }
}
