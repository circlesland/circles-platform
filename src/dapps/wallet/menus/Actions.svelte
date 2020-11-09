<script lang="ts">
  import { requestUbi } from "../processes/requestUbi";
  import type { Process } from "../../../main";
  import {ProcessEvent} from "../../../processes/processEvent";

  function sendMoney() {}
  function setTrust() {}

  let status:string = "";

  function getUBI() {
    const process: Process = window.stateMachines.run(requestUbi);

    process.events.subscribe((next) => {
      if (next.event?.type === "omo.notification") {
        console.log("RECEIVED NOTIFICATION:", next.event);
        status = next.event.message;
      } else if (next.event?.type === "omo.prompt") {
        console.log("RECEIVED PROMPT:", next.event);
      } else if (next.event?.type === "omo.error") {
        console.log("RECEIVED ERROR:", next.event);
        status = next.event.message;
      } else if (next.event?.type === "omo.success") {
        status = "The process completed successfully.";
      } else if (next.event?.type === "omo.continue") {
        console.log("RECEIVED CONTINUE:", next.event);
        status = next.event.message ?? "Continue";
      } else if (next.stopped) {
        console.log("COMPLETED - END");
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
  <h1>{status}</h1>
  <div class="w-full p-3 mb-3 border-2 border-primary" on:click={sendMoney}>
    Send Money
  </div>
  <div class="w-full p-3 border-2 border-primary" on:click={setTrust}>
    Trust
  </div>
  <div class="w-full p-3 border-2 border-primary" on:click={getUBI}>
    Get UBI
  </div>
</div>
