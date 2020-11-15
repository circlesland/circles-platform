<script lang="ts">
    import {PromptField} from "../../o-processes/processEvent";
    import AddressInput from "../atoms/AddressInput.svelte";
    import EtherInput from "../atoms/EtherInput.svelte";
    import StringInput from "../atoms/StringInput.svelte";
    import TextInput from "../atoms/TextInput.svelte";
    import PrivateKeyInput from "../atoms/PrivateKeyInput.svelte";
    import PercentInput from "../atoms/PercentInput.svelte";
    import BN from "bn.js";

    export let promptFields: { key: string, field: PromptField }[] = [];
    export let promptId: string = "";
    export let process;
    export let status;

    let promptFieldValues: { [key: string]: { type: string, data: any } } = {};
</script>
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
        {:else if promptField.field.type === "wei"}
            <span class="mr-3">{promptField.field.label}: </span>
            <EtherInput
                    weiValueBN={(promptField.field.value ?  promptField.field.value.data : new BN(0))}
                    on:value={(event) => {
                                const key = promptField.key;
                                promptFieldValues[key] = event.detail;
                            }}/>
        {:else if promptField.field.type === "string"}
            <span class="mr-3">{promptField.field.label}: </span>
            <StringInput
                    line={(promptField.field.value ?  promptField.field.value.data : "")}
                    on:value={(event) => {
                                    const key = promptField.key;
                                    promptFieldValues[key] = event.detail;
                                }}/>
        {:else if promptField.field.type === "text"}
            <span class="mr-3">{promptField.field.label}: </span>
            <TextInput
                    text={(promptField.field.value ?  promptField.field.value.data : "")}
                    on:value={(event) => {
                                    const key = promptField.key;
                                    promptFieldValues[key] = event.detail;
                                }}/>
        {:else if promptField.field.type === "bytestring"}
            <span class="mr-3">{promptField.field.label}: </span>
            <PrivateKeyInput
                    on:value={(event) => {
                                    const key = promptField.key;
                                    promptFieldValues[key] = event.detail;
                                }}/>
        {:else if promptField.field.type === "percent"}
            <span class="mr-3">{promptField.field.label}: </span>
            <PercentInput
                    percentValue={(promptField.field.value ?  promptField.field.value.data : 0)}
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
                }}>Cancel
</button>
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
                }}>Next
</button>
