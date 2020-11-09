import {Account} from "../libs/o-circles-protocol/interfaces/account";
import {Person} from "../libs/o-circles-protocol/model/person";
import {GnosisSafeProxy} from "../libs/o-circles-protocol/safe/gnosisSafeProxy";

export interface ProcessContext {
    account:Account,
    person: Person,
    safe: GnosisSafeProxy,
    other: {
        [key:string]:any
    }
}
