import {assign, createMachine, send} from "xstate";
import {ProcessContext} from "src/libs/o-processes/processContext";
import {ProcessEvent} from "src/libs/o-processes/processEvent";
import {ProcessDefinition} from "src/libs/o-processes/processManifest";
import {Address} from "../../../../libs/o-circles-protocol/interfaces/address";
import {ByteString} from "../../../../libs/o-circles-protocol/interfaces/byteString";
import {config} from "../../../../libs/o-circles-protocol/config";
import {mnemonicToEntropy} from "bip39";
import {push} from "svelte-spa-router";

export interface TransferCirclesContext extends ProcessContext
{
    connectSafe?: {
        safeAddress: {
            type:"ethereumAddress",
            data:Address
        },
        safeOwnerAddress:  {
            type:"ethereumAddress",
            data:Address
        },
        safeOwnerPrivateKey:  {
            type:"bytestring",
            data:ByteString
        }
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
                                .privateKeyToAccount("0x" + context.connectSafe.safeOwnerPrivateKey.data)
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
            on: {
                "omo.answer": {
                    actions:(context) => {
                        localStorage.setItem("omo.privateKey", "0x" + context.connectSafe.safeOwnerPrivateKey.data);
                        localStorage.setItem("omo.address", context.connectSafe.safeOwnerAddress.data);
                        localStorage.setItem("omo.safeAddress", context.connectSafe.safeAddress.data);

                        push("/wallet/" + context.connectSafe.safeAddress.data + "/safe");
                    }
                },
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
