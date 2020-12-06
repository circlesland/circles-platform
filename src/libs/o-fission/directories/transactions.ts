import {Directory, DirectoryChangeType} from "./directory";
import {TransactionsByWeek} from "../entities/transactionsByWeek";
import {Transaction} from "../entities/transaction";
import FileSystem from "webnative/fs/filesystem";

export class Transactions extends Directory<TransactionsByWeek>
{
  constructor(fs: FileSystem)
  {
    super(fs, ["transactions", "byWeek"]);
  }

  private _weeks: {
    [week:string]: TransactionsByWeek
  } = {};

  /**
   * Adds a new transaction to the week and initializes a new week if necessary.
   * After adding all transactions, the flushBulkTransactions() method must be called
   * to store the transactions to the fission drive.
   * @param transaction The transaction
   */
  async addBulkTransaction(transaction: Transaction)
  {
    const weekKey = transaction.year.toString() + "-" + transaction.week.toString();
    let currentWeek = this._weeks[weekKey];
    if (!currentWeek)
    {
      currentWeek = await this.tryGetByName(weekKey);
    }
    if (!currentWeek)
    {
      currentWeek = <TransactionsByWeek>{
        name: weekKey,
        year: transaction.year,
        week: transaction.week,
        transactions: []
      };
    }

    this._weeks[weekKey] = currentWeek;

    currentWeek.transactions.push(transaction);
    currentWeek.transactions.sort((a, b) =>
    {
      const tsA = Date.parse(a.timestamp);
      const tsB = Date.parse(b.timestamp);

      // Order desc by timestamp
      return tsA > tsB
        ? -1
        : tsA < tsB
          ? 1
          : 0;
    });
  }

  /**
   * Stores all added bulk transactions in one go and clears the _weeks buffer.
   */
  async flushBulkTransactions() : Promise<string>
  {
    for (const weeksKey in this._weeks)
    {
      const week = this._weeks[weeksKey];
      await this.addOrUpdate(week, false, "flushBulkTransactions");
    }
    const cid = await this.publish();
    this._weeks = {};

    return cid;
  }

  async maintainIndexes(change: DirectoryChangeType, entity: TransactionsByWeek, hint?: string): Promise<void>
  {
  }
}
