import { Account } from "src/libs/o-circles-protocol/interfaces/account";
import { Person } from "src/libs/o-circles-protocol/model/person";
import { GnosisSafeProxy } from "src/libs/o-circles-protocol/safe/gnosisSafeProxy";

export interface ProcessContext {
    account: Account,
    person: Person,
    safe: GnosisSafeProxy,
    other: {
        [key: string]: any
    }
}
