<script lang="ts">

  import {getUbi} from "../processes/getUBI";
  import type {Account} from "../../../libs/o-circles-protocol/interfaces/account";
  import type {Process} from "../../../main";

  function sendMoney() {
  }
  function setTrust() {

  }

  let status:string = "-";

  function getUBI() {
    const safeAddress = localStorage.getItem("omo.safeAddress");
    const account:Account = {
      privateKey: localStorage.getItem("omo.privateKey"),
      address: localStorage.getItem("omo.address"),
    }
    const machineDefinition = getUbi(account, safeAddress);

    const process:Process = window.stateMachines.start(machineDefinition);
    process.events.subscribe(next => {
      console.log("STATUS UPDATE:", next);
      status = next.message;
    });
  }
</script>
<div class="p-4">
  <h1>{status}</h1>
  <div class="w-full p-3 mb-3 border-2 border-primary" on:click={sendMoney}>Send Money</div>
  <div class="w-full p-3 border-2 border-primary" on:click={setTrust}>Trust</div>
  <div class="w-full p-3 border-2 border-primary" on:click={getUBI}>Get UBI</div>
</div>
