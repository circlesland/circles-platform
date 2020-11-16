import {assign, createMachine, send} from "xstate";
import {ProcessContext} from "src/libs/o-processes/processContext";
import {ProcessEvent} from "src/libs/o-processes/processEvent";
import {ProcessDefinition} from "src/libs/o-processes/processManifest";
import {Address} from "../../../../libs/o-circles-protocol/interfaces/address";
import {ByteString} from "../../../../libs/o-circles-protocol/interfaces/byteString";
import {config} from "../../../../libs/o-circles-protocol/config";
import {promptSuccess} from "../promptSuccess";
import {promptError} from "../promptError";
import {connectSafeService} from "./services/connectSafeService";

export interface ConnectSafeContext extends ProcessContext
{
    connectSafe?: {
        safeAddress?: {
            type:"ethereumAddress",
            data:Address
        },
        safeOwnerAddress?:  {
            type:"ethereumAddress",
            data:Address
        },
        safeOwnerPrivateKey?:  {
            type:"bytestring",
            data:ByteString
        }
    }
}

/**
 * Connect safe
 */
const processDefinition = createMachine<ConnectSafeContext, ProcessEvent>({
    initial: "ready",
    states: {
        ready: {
            on: {
                "omo.trigger": "promptSafeAddress",
                "omo.cancel": "stop"
            }
        },
        promptSafeAddress: {
            entry: "promptSafeAddress",
            on: {
                "omo.answer": {
                    actions: "storeSafeAddressToContext",
                    target: "promptPrivateKey"
                },
                "omo.trigger": {
                    actions: "promptSafeAddress"
                },
                "omo.cancel": "stop"
            }
        },
        promptPrivateKey: {
            entry: "promptPrivateKey",
            on: {
                "omo.answer": {
                    actions: "storePrivateKeyToContext",
                    target: "summarize"
                },
                "omo.trigger": {
                    actions: "promptPrivateKey"
                },
                "omo.cancel": "stop"
            }
        },
        summarize: {
            entry: "summarize",
            on: {
                "omo.answer": {
                    target: "connectSafe"
                },
                "omo.trigger": {
                    actions: "summarize"
                },
                "omo.cancel": "stop"
            }
        },
        connectSafe: {
            entry: send({
                type: "omo.notification",
                message: "Connecting safe .."
            }),
            invoke: {
                id: 'connectSafe',
                src: connectSafeService,
                onError: {
                    actions: promptError,
                    target: "error"
                },
                onDone: {
                    actions: promptSuccess,
                    target: "success"
                }
            }
        },
        success: {
            on: {
                "omo.answer": "stop",
                "omo.cancel": "stop",
                "omo.trigger": {
                    actions: promptSuccess
                }
            }
        },
        error: {
            on: {
                "omo.answer": "stop",
                "omo.cancel": "stop",
                "omo.trigger": {
                    actions: promptError
                }
            }
        },
        stop: {
            type: "final"
        }
    }
}, {
    guards: {},
    actions: {
        "promptSafeAddress":send({
            type: "omo.prompt",
            message: "Please enter the address of your safe below and click 'Next'",
            data: {
                id: "connectSafe",
                fields: {
                    "safeAddress": {
                        type: "ethereumAddress",
                        label: "Safe address"
                    }
                }
            }
        }),
        "promptPrivateKey":send({
            type: "omo.prompt",
            message: "Please enter the private key of the safe owner account and click 'Next'",
            data: {
                id: "connectSafe",
                fields: {
                    "safeOwnerPrivateKey": {
                        type: "bytestring",
                        label: "Safe owner private key"
                    }
                }
            }
        }),
        "summarize":send((context) =>
        {
            return {
                type: "omo.prompt",
                message: "Press 'Next' to confirm the values and connect your safe.",
                data: {
                    id: "connectSafe",
                    fields: {
                        "safeOwnerAddress": {
                            isReadonly: true,
                            type: "ethereumAddress",
                            label: "Safe owner address",
                            value: context.connectSafe.safeOwnerAddress
                        },
                        "safeAddress": {
                            isReadonly: true,
                            type: "ethereumAddress",
                            label: "Safe address",
                            value: context.connectSafe.safeAddress
                        }
                    }
                }
            }
        }),
        "storePrivateKeyToContext": assign((context, event: any) => {
            context.connectSafe.safeOwnerPrivateKey = event.data.fields.safeOwnerPrivateKey;
            context.connectSafe.safeOwnerAddress = {
                type: "ethereumAddress",
                data: config.getCurrent().web3()
                    .eth
                    .accounts
                    .privateKeyToAccount("0x" + context.connectSafe.safeOwnerPrivateKey.data)
                    .address
            };
            return context;
        }),
        "storeSafeAddressToContext":assign((context, event: any) =>
        {
            if (!context.connectSafe)
            {
                context.connectSafe = {};
            }
            context.connectSafe.safeAddress = event.data.fields.safeAddress;
            return context;
        })
    }
});

export const connectSafe: ProcessDefinition = {
    name: "connectSafe",
    stateMachine: processDefinition
};
