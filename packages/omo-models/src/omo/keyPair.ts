import { Entity } from "./entity";

/**
 * Can be used to store named public/private key pairs
 * in the fission drive.
 */
export interface KeyPair extends Entity {
  /**
   * The public key
   */
  publicKey?: string;
  /**
   * The private key
   */
  privateKey?: string;
}
