import type {BN} from "ethereumjs-util";
import type {GnosisSafeOps} from "./gnosisSafeOps";
import type {ByteString} from "./byteString";
import type {Address} from "./address";

export interface GnosisSafeTransaction
{
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
