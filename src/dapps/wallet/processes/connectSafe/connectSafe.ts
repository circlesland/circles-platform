import {assign, createMachine, send} from "xstate";
import {ProcessContext} from "src/libs/o-processes/processContext";
import {ProcessEvent} from "src/libs/o-processes/processEvent";
import {ProcessDefinition} from "src/libs/o-processes/processManifest";
import {Address} from "../../../../libs/o-circles-protocol/interfaces/address";
import {ByteString} from "../../../../libs/o-circles-protocol/interfaces/byteString";
import {config} from "../../../../libs/o-circles-protocol/config";

export interface TransferCirclesContext extends ProcessContext
{
    connectSafe?: {
        safeAddress: Address,
        safeOwnerAddress: Address,
        safeOwnerPrivateKey: ByteString
    }
}

/**
 * Connect safe
 */
const processDefinition = createMachine<TransferCirclesContext, ProcessEvent>({
    initial: "ready",
    states: {
        ready: {
            on: {
                "omo.trigger": "promptSafeAddress",
                "omo.cancel": "stop"
            }
        },
        promptSafeAddress: {
            entry: send({
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
            on: {
                "omo.answer": {
                    actions: assign((context: any, event: any) =>
                    {
                        if (!context.connectSafe)
                        {
                            context.connectSafe = {};
                        }
                        context.connectSafe.safeAddress = event.data.fields.safeAddress;
                    }),
                    target: "promptPrivateKey"
                },
                "omo.cancel": "stop"
            }
        },
        promptPrivateKey: {
            entry: send({
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
            on: {
                "omo.answer": {
                    actions: assign((context: any, event: any) => {
                        context.connectSafe.safeOwnerPrivateKey = event.data.fields.safeOwnerPrivateKey;
                        context.connectSafe.safeOwnerAddress = {
                            type: "bytestring",
                            data: config.getCurrent().web3()
                                .eth
                                .accounts
                                .privateKeyToAccount(context.connectSafe.safeOwnerPrivateKey.data)
                                .address
                        };
                    }),
                    target: "summarize"
                },
                "omo.cancel": "stop"
            }
        },
        summarize: {
            entry: send((context: TransferCirclesContext) =>
            {
                return {
                    type: "omo.prompt",
                    message: "Enter 'Deine Mudda oida' and click 'Next' to confirm the transaction",
                    data: {
                        id: "connectSafe",
                        fields: {
                            "safeOwnerAddress": {
                                type: "ethereumAddress",
                                label: "Safe owner address",
                                value: context.connectSafe.safeOwnerAddress
                            },
                            "safeAddress": {
                                type: "ethereumAddress",
                                label: "Safe address",
                                value: context.connectSafe.safeAddress
                            },
                            "confirmation": {
                                type: "string",
                                label: "Confirmation phrase"
                            }
                        }
                    }
                }
            }),
            on: {
                "omo.cancel": "stop"
            }
        },
        transferCircles: {
            invoke: {
                id: 'transferCircles',
                src: async (context) => null,
                onError: {
                    actions: []
                },
                onDone: {
                    actions: []
                }
            },
            on: {
                "omo.error": "stop",
                "omo.success": "stop"
            }
        },
        stop: {
            type: "final"
        }
    }
}, {
    guards: {},
    actions: {}
});

export const connectSafe: ProcessDefinition = {
    name: "connectSafe",
    stateMachine: processDefinition
};
