import {Entity} from "./entity";

export type ProfileType = "omosapien"|"circles"|"account";

/**
 * Describes the properties of a profile as stored in the user's fission drive
 */
export interface Profile extends Entity {
  /**
   * A transaction recipient can be an omosapien, a circles safe or a plain account on the xDai chain.
   */
  profileType: ProfileType;
  /**
   * Depending on the type, this field contains the corresponding handle or address.
   * For omosapien this is the fission username,
   * for cirlces its the safe address and for a plain account just the account address.
   */
  profileRef: string;
  /**
   * The user's first name
   */
  nickname?:string;
  /**
   * The user's first name
   */
  firstName?:string;
  /**
   * The user's last name
   */
  lastName?:string;
  /**
   * A URL encoded user picture
   */
  avatar?:string;
}
