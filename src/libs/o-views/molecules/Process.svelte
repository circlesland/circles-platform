<script lang="ts">
    import type {Process} from "../../../main";
    import {ProcessEvent, PromptField} from "../../o-processes/processEvent";
    import {ProcessDefinition} from "../../o-processes/processManifest";
    import Prompt from "./Prompt.svelte";
    import {ProcessContext} from "../../o-processes/processContext";

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

    let process: Process = null;

    export let definition: ProcessDefinition;
    export let contextInitializer: (processContext:ProcessContext) => ProcessContext;

    $:{
        if (definition) {
            process = runProcess();

            process.sendEvent(<ProcessEvent>{
                type: "omo.trigger",
            });
        }
    }

    function runProcess()
    {
        if (process)
        {
            throw new Error("There is already a running process.");
        }

        process = window.stateMachines.run(definition, contextInitializer);
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
            <Prompt status={status} process={process} promptFields={promptFields} promptId={promptId}></Prompt>
        {/if}
    {:else}
        <h1>Invalid process</h1>
    {/if}
</div>
