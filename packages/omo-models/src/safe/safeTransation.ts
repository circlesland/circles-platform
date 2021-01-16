import type BN from "bn.js";
import type { ByteString } from "./byteString";
import type { Address } from "./address";

export interface SafeTransaction {
  to: Address;
  value: BN;
  data: ByteString;
  operation: GnosisSafeOps;
  safeTxGas?: BN;
  baseGas?: BN;
  gasToken: Address;
  refundReceiver: Address;
  nonce?: number;
}
