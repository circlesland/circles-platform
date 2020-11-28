import {Account} from "../../o-circles-protocol/interfaces/account";
import {Person} from "../../o-circles-protocol/model/person";
import {GnosisSafeProxy} from "../../o-circles-protocol/safe/gnosisSafeProxy";

export interface ProcessEnvironment {
  account: Account,
  person: Person,
  safe: GnosisSafeProxy,
}
