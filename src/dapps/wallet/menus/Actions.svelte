<script lang="ts">
  import { requestUbi } from "../processes/requestUbi";
  import type { Process } from "../../../main";
  import { ProcessEvent, PromptField } from "../../../processes/processEvent";

  function sendMoney() {}
  function setTrust() {}

  let statusType:
    | "none"
    | "message"
    | "notification"
    | "success"
    | "error"
    | "prompt" = "none";
  let status: string = "";

  let prompFields: { [id: string]: PromptField } = {};
  let prompTrigger: { [id: string]: () => ProcessEvent } = {};

  let process: Process = null;

  function getUBI() {
    process = window.stateMachines.run(requestUbi);

    process.events.subscribe((next) => {
      if (next.event?.type === "omo.notification") {
        statusType = "notification";
        status = next.event.message;
      } else if (next.event?.type === "omo.prompt") {
        statusType = "prompt";
        prompFields = next.event.data.fields;
        prompTrigger = next.event.data.trigger;
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

    process.sendEvent(<ProcessEvent>{
      type: "omo.trigger",
    });
  }
</script>

<style>
  .iphonex {
    padding-bottom: 0;
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
</style>

<div class="p-4 space-y-2 border-t border-gray-300 iphonex">
  {#if process}
    {#if statusType === 'message'}
      <h1 class="px-4 py-8 mb-4 text-center rounded text-primary bg-light-100">
        {status}
      </h1>
    {:else if statusType === 'notification'}
      <h1 class="px-4 py-8 mb-4 text-center text-white bg-orange-300 rounded">
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
    {:else if statusType === 'prompt'}Prompt:<br />{:else}{/if}
  {:else}
    <div
      class="w-full p-3 mb-3 text-center uppercase border-2 rounded border-primary text-primary hover:bg-primary hover:text-white"
      on:click={getUBI}>
      Get Universal basic income
    </div>
    <div
      class="w-full p-3 mb-3 text-center uppercase border-2 rounded border-primary text-primary hover:bg-primary hover:text-white">
      invite friend (send 0.01 xdai)
    </div>
    <div
      class="w-full p-3 mb-3 text-center uppercase border-2 rounded border-primary text-primary hover:bg-primary hover:text-white"
      on:click={setTrust}>
      add trusted friend
    </div>
    <div class="flex space-x-2">
      <div
        class="w-full p-3 mb-3 text-center uppercase border-2 rounded border-primary text-primary hover:bg-primary hover:text-white">
        Receive Money
      </div>
      <div
        class="w-full p-3 mb-3 text-center uppercase border-2 rounded border-primary text-primary hover:bg-primary hover:text-white"
        on:click={sendMoney}>
        Send Money
      </div>
    </div>
  {/if}
</div>
