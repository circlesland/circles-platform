<script lang="ts">

  import {getUbi} from "../processes/getUBI";
  import type {Account} from "../../../libs/o-circles-protocol/interfaces/account";

  function sendMoney() {
  }
  function setTrust() {

  }
  function getUBI() {
    const safeAddress = localStorage.getItem("omo.safeAddress");
    const account:Account = {
      privateKey: localStorage.getItem("omo.privateKey"),
      address: localStorage.getItem("omo.address"),
    }
    const machineFactory = getUbi(account, safeAddress);
    window.stateMachines.start(machineFactory);
  }
</script>
<div class="p-4">
  <div class="w-full p-3 mb-3 border-2 border-primary" on:click={sendMoney}>Send Money</div>
  <div class="w-full p-3 border-2 border-primary" on:click={setTrust}>Trust</div>
  <div class="w-full p-3 border-2 border-primary" on:click={getUBI}>Get UBI</div>
</div>
