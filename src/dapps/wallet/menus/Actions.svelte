<script lang="ts">

    import BN from "bn.js";
    import {requestUbi} from "../processes/requestUbi/requestUbi";
    import type {Process} from "../../../main";
    import {transferCircles} from "../processes/transferCircles/transferCircles";
    import {setTrust} from "../processes/setTrust";
    import {connectSafe} from "../processes/connectSafe/connectSafe";
    import {ProcessEvent, PromptField} from "../../../libs/o-processes/processEvent";
    import {ProcessDefinition} from "../../../libs/o-processes/processManifest";
    import AddressInput from "../../../libs/o-views/atoms/AddressInput.svelte";
    import EtherInput from "../../../libs/o-views/atoms/EtherInput.svelte";
    import StringInput from "../../../libs/o-views/atoms/StringInput.svelte";
    import TextInput from "../../../libs/o-views/atoms/TextInput.svelte";
    import PrivateKeyInput from "../../../libs/o-views/atoms/PrivateKeyInput.svelte";

    let statusType:
        | "none"
        | "message"
        | "notification"
        | "success"
        | "error"
        | "prompt" = "none";
    let status: string = "";

    let promptId: string = "";
    let promptFields: { key: string, field: PromptField }[] = [];
    let promptFieldValues: { [key: string]: { type: string, data: any } } = {};
    let promptTrigger: { [id: string]: () => ProcessEvent } = {};

    let process: Process = null;

    function runRequestUbi()
    {
        const process = runProcess(requestUbi);
        process.sendEvent(<ProcessEvent>{
            type: "omo.trigger",
        });
    }

    function runTransferCircles()
    {
        const process = runProcess(transferCircles);
        process.sendEvent(<ProcessEvent>{
            type: "omo.trigger",
        });
    }

    function runSetTrust()
    {
        const process = runProcess(setTrust);
        process.sendEvent(<ProcessEvent>{
            type: "omo.trigger",
        });
    }

    function runRemoveTrust()
    {
        const process = runProcess(setTrust);
        process.sendEvent(<ProcessEvent>{
            type: "omo.trigger",
        });
    }

    function runConnectSafe()
    {
        const process = runProcess(connectSafe);
        process.sendEvent(<ProcessEvent>{
            type: "omo.trigger",
        });
    }

    function runProcess(definition: ProcessDefinition)
    {
        if (process)
        {
            throw new Error("There is already a running process.");
        }

        process = window.stateMachines.run(definition);
        process.events.subscribe((next) =>
        {
            if (next.event?.type === "omo.notification")
            {
                statusType = "notification";
                status = next.event.message;
            }
            else if (next.event?.type === "omo.prompt")
            {
                statusType = "prompt";
                status = next.event.message;
                promptId = next.event.data.id;
                promptFields = Object.keys(next.event.data.fields).map(key =>
                {
                    return {
                        key: key,
                        field: next.event.data.fields[key]
                    };
                });
                promptTrigger = next.event.data.trigger;
            }
            else if (next.event?.type === "omo.error")
            {
                statusType = "error";
                status = next.event.message;
            }
            else if (next.event?.type === "omo.success")
            {
                statusType = "success";
                status = "The process completed successfully.";
            }
            else if (next.event?.type === "omo.continue")
            {
                statusType = "message";
                status = next.event.message ?? "Continue";
            }
            else if (next.stopped)
            {
                setTimeout(() =>
                {
                    process = null;
                }, 3000);
            }
        });

        return process;
    }
</script>

<div class="w-full p-4 space-y-2 border-t border-gray-300 rounded-t-xl">
    {#if process}
        {#if statusType === 'message'}
            <h1 class="px-4 py-8 mb-4 text-center rounded text-primary bg-light-100">
                {status}
            </h1>
        {:else if statusType === 'notification'}
            <h1 class="px-4 py-8 mb-4 text-center bg-orange-300 rounded text-primary">
                {status}
            </h1>
        {:else if statusType === 'error'}
            <h1 class="px-4 py-8 mb-4 text-center text-white bg-red-400 rounded">
                {status}
            </h1>
        {:else if statusType === 'success'}
            <h1 class="px-4 py-8 mb-4 text-center text-white rounded bg-action">
                {status}
            </h1>
        {:else if statusType === 'prompt'}
            <h1 class="px-4 py-8 mb-4 text-center text-white rounded bg-action">
                {status}
            </h1>
            {#each promptFields as promptField}
                <div class="flex">
                    {#if promptField.field.type === "ethereumAddress"}
                        <span class="mr-3">{promptField.field.label}: </span>
                        <AddressInput
                            hexByteString={(promptField.field.value ? promptField.field.value.data : "")}
                            on:value={(event) => {
                                const key = promptField.key;
                                promptFieldValues[key] = event.detail;
                            }}/>
                    {:else if  promptField.field.type === "wei"}
                        <span class="mr-3">{promptField.field.label}: </span>
                        <EtherInput
                            weiValueBN={(promptField.field.value ?  promptField.field.value.data : new BN(0))}
                            on:value={(event) => {
                                const key = promptField.key;
                                promptFieldValues[key] = event.detail;
                            }}/>
                    {:else if  promptField.field.type === "string"}
                        <span class="mr-3">{promptField.field.label}: </span>
                        <StringInput
                                line={(promptField.field.value ?  promptField.field.value.data : "")}
                                on:value={(event) => {
                                    const key = promptField.key;
                                    promptFieldValues[key] = event.detail;
                                }}/>
                    {:else if  promptField.field.type === "text"}
                        <span class="mr-3">{promptField.field.label}: </span>
                        <TextInput
                                text={(promptField.field.value ?  promptField.field.value.data : "")}
                                on:value={(event) => {
                                    const key = promptField.key;
                                    promptFieldValues[key] = event.detail;
                                }}/>
                    {:else if  promptField.field.type === "bytestring"}
                        <span class="mr-3">{promptField.field.label}: </span>
                        <PrivateKeyInput
                                on:value={(event) => {
                                    const key = promptField.key;
                                    promptFieldValues[key] = event.detail;
                                }}/>
                    {:else}
                        {JSON.stringify(promptField, null, 2)}
                    {/if}
                </div>
            {/each}
            <button on:click={() => {
                    process.sendEvent({
                        type: "omo.cancel",
                    });
                    process = null;
                }}>Cancel</button>
            <button on:click={() => {
                    const answer = {
                        type: "omo.answer",
                        message: "",
                        data: {
                            id: promptId,
                            fields: promptFieldValues
                        }
                    };
                    process.sendEvent(answer);
                    console.log("Sent", answer);
                    promptFieldValues = {};
                }}>Next</button>
        {/if}
    {:else}
        <div class="space-y-2">
            <div
                    class="w-full p-2 font-bold text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white"
                    on:click={runRequestUbi}>
                Get Universal basic income
            </div>
            <div
                    class="w-full p-2 font-bold text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white">
                invite friend (send 0.01 xdai)
            </div>
            <div class="flex space-x-2">
                <div
                        class="w-full p-2 text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white"
                        on:click={runSetTrust}>
                    add friend
                </div>
            </div>
            <div class="flex space-x-2">
                <div
                        class="w-full p-2 font-bold text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white">
                    Receive Money
                </div>
                <div
                        class="w-full p-2 font-bold text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white"
                        on:click={runTransferCircles}>
                    Send Money
                </div>
            </div>
            <div class="flex space-x-2">
                <div
                        class="w-full p-2 font-bold text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white"
                        on:click={runConnectSafe}>
                    Connect Safe
                </div>
            </div>
        </div>
    {/if}
</div>
