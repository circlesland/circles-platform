import {assign, createMachine, send} from "xstate";
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
    | { type: "TRIGGER" }
    | { type: "STOP" }
    | { type: "ERROR_YOU_RECENTLY_REQUESTED_UBI" }
    | { type: "ERROR_TOO_FREQUENT" }
    | { type: "ERROR_REQUEST_FAILED" }
    | { type: "SUCCESS" };

const TwelveHours = 12 * 60 * 60 * 60 * 1000;
const TwentySeconds = 20 * 1000;

/**
 * A state machine that runs as service and requests the UBI for the user.
 */
const machineDefinition = createMachine<GetUBIContext, GetUBIEvent>({
    initial: "ready",
    states: {
        ready: {
            on: {
                TRIGGER: [{
                    cond: "recentlyGotUbi?",
                    target: "ready",
                    actions: [
                        "setNextPossibleUbiRetrieval",
                        send({ type: "ERROR_YOU_RECENTLY_REQUESTED_UBI" })
                    ]
                }, {
                    cond: "canRetrieveNewUbi?",
                    target: "requestUbi",
                    actions: ["setNextPossibleUbiRetrieval"]
                }, {
                    target: "ready",
                    actions: [
                        "setNextPossibleUbiRetrieval",
                        send({ type: "ERROR_TOO_FREQUENT" })
                    ]
                }],
                STOP: {
                    target: "stop"
                }
            }
        },
        requestUbi: {
            invoke: {
                id: 'requestingUbi',
                src: async (context) => context.person.getUBI(context.account, context.safe),
                onError: {
                    target: 'error'
                },
                onDone: {
                    actions: ["setLastSuccessfulUbiRetrieval"],
                    target: 'success'
                }
            }
        },
        error: {
            always: "ready",
            entry: send({ type: "ERROR_REQUEST_FAILED" })
        },
        success: {
            always: "ready",
            entry: send({ type: "SUCCESS" })
        },
        stop: {
            type: "final"
        }
    }
}, {
    guards: {
        "recentlyGotUbi?": () => {
            const lastSuccessfulUbiRetrieval = localStorage.getItem("omo.lastSuccessfulUbiRetrieval");
            return lastSuccessfulUbiRetrieval
                ? Date.now() - parseInt(lastSuccessfulUbiRetrieval) < TwelveHours
                : false;
        },
        "canRetrieveNewUbi?": (context, event) =>
        {
            const now = Date.now();

            // A User can retrieve new UBI when:
            // 1. At least 12 hours after the last successful retrieval passed by
            const lastSuccessfulUbiRetrieval = localStorage.getItem("omo.lastSuccessfulUbiRetrieval");
            const recentlyGotUbi = !lastSuccessfulUbiRetrieval
                ? false
                : Date.now() - parseInt(lastSuccessfulUbiRetrieval) < TwelveHours;

            if (recentlyGotUbi)
                return false;

            // 2. The omo.nextPossibleUbiRetrieval time is in the past or not set
            const nextPossibleUbiRetrieval = localStorage.getItem("omo.nextPossibleUbiRetrieval");
            return !nextPossibleUbiRetrieval
                ? true
                : now > parseInt(nextPossibleUbiRetrieval);
        }
    },
    actions: {
        "setNextPossibleUbiRetrieval":()=> {
            localStorage.setItem("omo.nextPossibleUbiRetrieval", (Date.now() + TwentySeconds).toString());
        },
        "setLastSuccessfulUbiRetrieval":()=> {
            localStorage.setItem("omo.lastSuccessfulUbiRetrieval", Date.now().toString());
        }
    }
});

export const getUbi = (account:Account, safeAddress:Address) => {
    const web3 = config.getCurrent().web3();
    const circlesHub = new CirclesHub(web3, config.getCurrent().HUB_ADDRESS);

    const context = {
        account,
        person: new Person(circlesHub, safeAddress),
        safe: new GnosisSafeProxy(web3, account.address, safeAddress)
    };

    return {
        context,
        machineDefinition
    };
}
