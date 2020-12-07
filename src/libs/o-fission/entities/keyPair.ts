import { Entity } from "./entity";
import { ByteString } from "../../o-circles-protocol/interfaces/byteString";

/**
 * Can be used to store named public/private key pairs
 * in the fission drive.
 */
export interface KeyPair extends Entity {
  /**
   * The public key
   */
  publicKey?: ByteString;
  /**
   * The private key
   */
  privateKey?: ByteString;
}
