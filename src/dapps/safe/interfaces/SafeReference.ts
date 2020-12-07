import { Address } from "../../../libs/o-circles-protocol/interfaces/address";
import { ByteString } from "../../../libs/o-circles-protocol/interfaces/byteString";

export interface SafeReference {
  owner: Address,
  privateKey: ByteString,
  address: Address
}
