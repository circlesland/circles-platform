import {createMachine} from "xstate";
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
    | { type: "STOP" };

/**
 * A state machine that runs as a service and
 */
const machineDefinition = createMachine<GetUBIContext, GetUBIEvent>({
    initial: "ready",
    states: {
        ready: {
            on: {
                TRIGGER: [{
                    cond: "tooFrequent?",
                    target: "error",
                    meta: {
                        message: "The UBI request can only be executed every 12 hours."
                    }
                }, {
                    target: "requestUbi"
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
                    target: 'success'
                }
            },
            meta: {
                message: "Requesting UBI .."
            }
        },
        error: {
            entry: () => {
                // Delay the next attempt for 10 seconds
                localStorage.setItem("omo.nextPossibleUbiRetrieval", (Date.now() + 10 * 60 * 1000).toString())
            },
            always: "ready",
            meta: {
                message: "ERROR: Couldn't request your UBI."
            }
        },
        success: {
            entry: () => {
                // Delay the next attempt for 12 hours
                localStorage.setItem("omo.nextPossibleUbiRetrieval", (Date.now() + 12 * 60 * 60 * 60 * 1000).toString())
            },
            always: "ready",
            meta: {
                message: "SUCCESS: Successfully requested UBI."
            }
        },
        stop: {
            type: "final",
            meta: {
                message: "STOPPED"
            }
        }
    }
}, {
    guards: {
        "tooFrequent?": (context, event) => {
            const nextPossibleUbiRetrieval = localStorage.getItem("omo.nextPossibleUbiRetrieval");
            if (!nextPossibleUbiRetrieval) {
                return false;
            }
            return Date.now() < parseInt(nextPossibleUbiRetrieval);
        }
    },
    actions: {
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
