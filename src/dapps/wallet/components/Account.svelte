<script lang="ts">
  import { CirclesHub } from "../../../libs/o-circles-protocol/circles/circlesHub";
  import { Person } from "../../../libs/o-circles-protocol/model/person";
  import { config } from "../../../libs/o-circles-protocol/config";
  import type { Address } from "../../../libs/o-circles-protocol/interfaces/address";

  export let address: string;

  let person: Person;
  let mySafeAddress: Address;

  function init(safeAddress?: string) {
    const hubAddress = config.getCurrent().HUB_ADDRESS;
    const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);
    mySafeAddress = localStorage.getItem("omo.safeAddress");
    person = new Person(circlesHub, safeAddress ?? mySafeAddress);
  }

  $: {
    init(address);
  }
</script>

<div
  class="flex items-center justify-center font-bold text-center text-gray-500 bg-gray-100">
  {#if mySafeAddress === address}
    <p class="text-xs">
      <span class="uppercase">my safe address</span><br />{person.address}
    </p>
  {:else}{person.address}{/if}
</div>
