<script lang="ts">
  import { CirclesHub } from "src/libs/o-circles-protocol/circles/circlesHub";
  import { Person } from "src/libs/o-circles-protocol/model/person";
  import { config } from "src/libs/o-circles-protocol/config";
  import type { Address } from "src/libs/o-circles-protocol/interfaces/address";

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

<div class="flex items-center justify-center py-2">
  <p class="px-3 py-1 text-xs text-light-400">Safe: {person.address}</p>
</div>
