<script lang="ts">
  import { ubiService } from "../processes/ubiService";
  import type { Account } from "../../../libs/o-circles-protocol/interfaces/account";
  import type { Process } from "../../../main";
  import {ProcessContext} from "../../../processes/processContext";
  import {GnosisSafeProxy} from "../../../libs/o-circles-protocol/safe/gnosisSafeProxy";
  import {config} from "../../../libs/o-circles-protocol/config";
  import {Person} from "../../../libs/o-circles-protocol/model/person";
  import {CirclesHub} from "../../../libs/o-circles-protocol/circles/circlesHub";
  import {useMachine} from "xstate-svelte";

  function sendMoney() {}
  function setTrust() {}

  let status: string = "-";

  function getUBI() {
    const process: Process = window.stateMachines.run(ubiService);
    process.events.subscribe((next) => {
      console.log("STATUS UPDATE:", next);
      status = next.message;
    });
    process.sendEvent(<ServiceEvents>{
      type: "TRIGGER",
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
