/**
 * Can either represent a transaction or any contract event.
 */
import {Entity} from "./entity";


/**
 * Groups multiple blockchain events and transactions.
 */
export interface CacheEventGroup extends Entity
{
  /**
   * The cached events in this group.
   */
  events: {
    [blockNo:number]: CacheEvent[]
  };
}

export interface CacheEvent
{
  /**
   * The name of the event source.
   */
  source: string;
  /**
   * If this is an event the this property contains the event type.
   */
  eventType?: string;
  /**
   * If this is a transaction then this property contains the transaction hash.
   */
  transactionHash?: string;

  /**
   * The block hash.
   */
  blockHash: string;
  /**
   * The block number.
   */
  blockNo: number;

  /**
   * Either the emitter of an event or the sender of a transaction.
   */
  senderType: "omosapien"|"circles"|"account"|"contract";
  /**
   * Depending on the type, this field contains the corresponding handle or address.
   * For omosapien this is the fission username,
   * for cirlces its the safe address and for a plain account just the account address.
   */
  senderRef: string;

  /**
   * When this is a transaction, this property contains the receiver of the transaction's value.
   */
  recipientType?: "omosapien"|"circles"|"account";
  /**
   * Depending on the type, this field contains the corresponding handle or address.
   * For omosapien this is the fission username,
   * for cirlces its the safe address and for a plain account just the account address.
   */
  recipientRef?: string;

  /**
   * The transaction value in wei (of circles).
   */
  valueInWei?: string;
  /**
   * Optional additional data concerning the event.
   */
  data?: string;
}
