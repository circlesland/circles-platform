import {Entity} from "./entity";

/**
 * Describes the properties of a profile as stored in the user's fission drive
 */
export interface Token extends Entity {
  /**
   * Can contain the address of the user's gnosis safe proxy
   * which is registered at the circles hub.
   */
  circlesAddress?:string;
  /**
   * The token's address.
   */
  tokenAddress?:string;
}
