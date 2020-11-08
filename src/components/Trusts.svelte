<script lang="ts">
  import { CirclesHub } from "../libs/o-circles-protocol/circles/circlesHub";
  import {Person} from "../libs/o-circles-protocol/model/person";
  import type {AddressLookup, TokenAndOwner} from "../libs/o-circles-protocol/model/person";
  import { config } from "../libs/o-circles-protocol/config";
  import type {Address} from "../libs/o-circles-protocol/interfaces/address";

  let person: Person;
  let personsThatTrustMe:[] = [];
  let personsThatITrust:[] = [];

  function init() {
    const hubAddress = config.getCurrent().HUB_ADDRESS;
    const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);
    const safeAddress = localStorage.getItem("omo.safeAddress");

    person = new Person(circlesHub, safeAddress);

    reload();
  }

  async function reload() {
    let t1 = await person.getPersonsThatTrustMe();
    personsThatTrustMe = Object.keys(t1).map(k => t1[k]);

    let t2  = await person.getPersonsITrust();
    personsThatITrust = Object.keys(t2).map(k => t2[k]);
  }

  init();
</script>

<b class="text-primary">Trusting:</b>
{#each personsThatTrustMe as address}
  <div class="mx-4 mb- 2">
    <div class="flex w-full bg-white border border-gray-300 rounded">
      <div class="flex-1 px-4 py-2 text-base">
        <b class="text-primary">{address.owner.address}</b>
      </div>
    </div>
  </div>
{/each}

<b class="text-primary">Trusted:</b>
{#each personsThatITrust as address}
  <div class="mx-4 mb- 2">
    <div class="flex w-full bg-white border border-gray-300 rounded">
      <div class="flex-1 px-4 py-2 text-base">
        <b class="text-primary">{address.owner.address}</b>
      </div>
    </div>
  </div>
{/each}
