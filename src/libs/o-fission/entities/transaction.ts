import {Entity} from "./entity";

/**
 * Describes a transaction as stored in the fission drive.
 */
export interface Transaction extends Entity {
  /**
   * A JSON formatted Date value.
   */
  timestamp: string;

  /**
   * The year in four digit format.
   */
  year: number;
  /**
   * The week in which the transaction took place.
   * Format: yyyy-ww
   * All transactions of a week are grouped into one file in the fission drive.
   */
  week: number;

  /**
   * A transaction recipient can be an omosapien, a circles safe or a plain account on the xDai chain.
   */
  senderType: "omosapien"|"circles"|"account";
  /**
   * Depending on the type, this field contains the corresponding handle or address.
   * For omosapien this is the fission username,
   * for cirlces its the safe address and for a plain account just the account address.
   */
  senderRef: string;

  /**
   * A transaction recipient can be an omosapien, a circles safe or a plain account on the xDai chain.
   */
  recipientType: "omosapien"|"circles"|"account";
  /**
   * Depending on the type, this field contains the corresponding handle or address.
   * For omosapien this is the fission username,
   * for cirlces its the safe address and for a plain account just the account address.
   */
  recipientRef: string;

  /**
   * The transaction value in wei (of circles).
   */
  valueInWei: string;
  /**
   * Optional additional data concerning the tranasction.
   */
  data?: string;
}
