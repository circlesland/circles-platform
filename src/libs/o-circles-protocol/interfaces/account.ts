import type {ByteString} from "./byteString";
import type {Addressable} from "./addressable";

export interface Account extends Addressable
{
  privateKey?: ByteString
}
