<script lang="ts">
  import { requestUbi } from "../processes/requestUbi";
  import type { Process } from "../../../main";
  import { ProcessEvent, PromptField } from "../../../processes/processEvent";
  import { ProcessDefinition } from "../../../processes/processManifest";
  import { transferCircles } from "../processes/transferCircles";
  import { setTrust } from "../processes/setTrust";

  let statusType:
    | "none"
    | "message"
    | "notification"
    | "success"
    | "error"
    | "prompt" = "none";
  let status: string = "";

  let promptFields: { [id: string]: PromptField } = {};
  let promptTrigger: { [id: string]: () => ProcessEvent } = {};

  let process: Process = null;

  function runRequestUbi() {
    const process = runProcess(requestUbi);
    process.sendEvent(<ProcessEvent>{
      type: "omo.trigger",
    });
  }

  function runTransferCircles() {
    const process = runProcess(transferCircles);
    process.sendEvent(<ProcessEvent>{
      type: "omo.trigger",
    });
  }

  function runSetTrust() {
    const process = runProcess(setTrust);
    process.sendEvent(<ProcessEvent>{
      type: "omo.trigger",
    });
  }

  function runProcess(definition: ProcessDefinition) {
    if (process) {
      throw new Error("There is already a running process.");
    }

    process = window.stateMachines.run(definition);
    process.events.subscribe((next) => {
      if (next.event?.type === "omo.notification") {
        statusType = "notification";
        status = next.event.message;
      } else if (next.event?.type === "omo.prompt") {
        statusType = "prompt";
        promptFields = next.event.data.fields;
        promptTrigger = next.event.data.trigger;
      } else if (next.event?.type === "omo.error") {
        statusType = "error";
        status = next.event.message;
      } else if (next.event?.type === "omo.success") {
        statusType = "success";
        status = "The process completed successfully.";
      } else if (next.event?.type === "omo.continue") {
        statusType = "message";
        status = next.event.message ?? "Continue";
      } else if (next.stopped) {
        setTimeout(() => {
          process = null;
        }, 4000);
      }
    });

    return process;
  }
</script>

<style>
  .iphonex {
    padding-bottom: 0;
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
</style>

<div class="w-full p-4 space-y-2 border-t border-gray-300 rounded-t-xl iphonex">
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
    {:else if statusType === 'prompt'}Prompt:<br />{/if}
  {:else}
    <div
      class="w-full p-3 text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white"
      on:click={runRequestUbi}>
      Get Universal basic income
    </div>
    <div
      class="w-full p-3 mb-3 text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white">
      invite friend (send 0.01 xdai)
    </div>
    <div
      class="w-full p-3 mb-3 text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white"
      on:click={runSetTrust}>
      add trusted friend
    </div>
    <div class="flex space-x-2">
      <div
        class="w-full p-3 mb-3 text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white">
        Receive Money
      </div>
      <div
        class="w-full p-3 mb-3 text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white"
        on:click={runTransferCircles}>
        Send Money
      </div>
    </div>
  {/if}
</div>
