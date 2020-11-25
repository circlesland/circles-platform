import {Account} from "src/libs/o-circles-protocol/interfaces/account";
import {Person} from "src/libs/o-circles-protocol/model/person";
import {GnosisSafeProxy} from "src/libs/o-circles-protocol/safe/gnosisSafeProxy";

export interface ProcessContext
{
  account: Account,
  person: Person,
  safe: GnosisSafeProxy,

  /**
   * If the process failed, this property contains the error.
   */
  error?: any,
  /**
   * Contains a result value if the process executed successfully.
   */
  result?: any,

  /**
   * Contains all data that's collected during the process' execution.
   */
  data?: {
    [key: string]: any
  },
}
