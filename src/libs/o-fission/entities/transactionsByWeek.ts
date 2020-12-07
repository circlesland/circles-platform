import { Entity } from "./entity";
import { Transaction } from "./transaction";

/**
 * Groups all transactions of a week.
 */
export interface TransactionsByWeek extends Entity {
  year: number;
  /**
   * The week.
   */
  week: number;
  /**
   * All cached transactions of the week.
   */
  transactions: Transaction[];
}
