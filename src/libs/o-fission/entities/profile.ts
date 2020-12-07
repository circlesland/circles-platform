import { Entity } from "./entity";

/**
 * Describes the properties of a profile as stored in the user's fission drive
 */
export interface Profile extends Entity {
  /**
   * Can contain the address of the user's gnosis safe proxy
   * which is registered at the circles hub.
   */
  circlesAddress?: string;
  /**
   * The user's first name
   */
  nickname?: string;
  /**
   * The user's first name
   */
  firstName?: string;
  /**
   * The user's last name
   */
  lastName?: string;
  /**
   * A URL encoded user picture // TODO: only keep a reference and move the data to somewhere else
   */
  avatar?: string;
}
