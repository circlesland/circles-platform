import {createMachine} from "xstate";
import {useMachine} from "xstate-svelte";
import {Person} from "../../../libs/o-circles-protocol/model/person";
import type {Account} from "../../../libs/o-circles-protocol/interfaces/account";
import type {Address} from "../../../libs/o-circles-protocol/interfaces/address";
import {CirclesHub} from "../../../libs/o-circles-protocol/circles/circlesHub";
import {config} from "../../../libs/o-circles-protocol/config";
import {GnosisSafeProxy} from "../../../libs/o-circles-protocol/safe/gnosisSafeProxy";

export interface GetUBIContext {
    account:Account,
    person: Person,
    safe: GnosisSafeProxy
}

export type GetUBIEvent =
    | { type: "START" };

const buildContext = (context?: GetUBIContext): GetUBIContext => context;
const machineDefinition = createMachine<GetUBIContext, GetUBIEvent>({
    initial: "idle",
    context: buildContext(),
    states: {
        idle: {
            entry: (context) => console.log("IDLE", context),
            always: [{
                cond:"tooFrequent?",
                target: "error"
            }, {
                target: "requestUbi"
            }],
            meta: {
                message: "Starting .."
            }
        },
        requestUbi: {
            entry: ["requestUbi"],
            always: "success",
            meta: {
                message: "Requesting UBI .."
            }
        },
        error: {
            entry: () => console.log("ERROR"),
            type: "final",
            meta: {
                message: "Couldn't request your UBI."
            }
        },
        success: {
            type: "final",
            entry: ["saveLastUbiRetrieval"],
            meta: {
                message: "Successfully requested UBI."
            }
        }
    }
}, {
    guards: {
        "tooFrequent?": (context, event) => {
            const lastUbiRetrieval = localStorage.getItem("omo.lastUbiRetrieval");
            if (!lastUbiRetrieval) {
                return false;
            }
            const diffInMilliseconds = Date.now() - parseInt(lastUbiRetrieval);
            const diffInHours = diffInMilliseconds / 1000 / 60 / 60 / 60;
            return diffInHours < 12;
        }
    },
    actions: {
        "requestUbi": async (context, event) => {
            console.log("REQUEST UBI");
            await context.person.getUBI(context.account, context.safe);
        },
        "saveLastUbiRetrieval": async (context, event) => {
            console.log("SUCCESS");
            localStorage.setItem("omo.lastUbiRetrieval", Date.now().toString());
        }
    }
});

export const getUbi = (account:Account, safeAddress:Address) => {
    return () =>
    {
        console.log("Account: ", account);
        const web3 = config.getCurrent().web3();
        const circlesHub = new CirclesHub(web3, config.getCurrent().HUB_ADDRESS);
        const {send, state, service} = useMachine(machineDefinition, {
            context: {
                account,
                person: new Person(circlesHub, safeAddress),
                safe: new GnosisSafeProxy(web3, account.address, safeAddress)
            }
        });

        return {
            send,
            state,
            service
        };
    }
}
