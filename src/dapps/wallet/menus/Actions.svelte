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

<div class="p-4 iphonex">
  {#if process}
    {#if statusType === 'message'}
      Message:<br />
      <h1 class="bg-white">{status}</h1>
    {:else if statusType === 'notification'}
      Notification:<br />
      <h1 class="bg-yellow">{status}</h1>
    {:else if statusType === 'error'}
      Error:<br />
      <h1 class="bg-red">{status}</h1>
    {:else if statusType === 'success'}
      Success:<br />
      <h1 class="bg-green">{status}</h1>
    {:else if statusType === 'prompt'}Prompt:<br />{:else}{/if}
  {:else}
    <div class="w-full p-3 mb-3 border-2 border-primary" on:click={sendMoney}>
      Send Money
    </div>
    <div class="w-full p-3 border-2 border-primary" on:click={setTrust}>
      Trust
    </div>
    <div class="w-full p-3 border-2 border-primary" on:click={getUBI}>
      Get UBI
    </div>
  {/if}
</div>
