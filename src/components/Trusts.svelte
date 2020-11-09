<script lang="ts">
  import { CirclesHub } from "../libs/o-circles-protocol/circles/circlesHub";
  import {Person} from "../libs/o-circles-protocol/model/person";
  import { config } from "../libs/o-circles-protocol/config";

  let person: Person;
  let personsThatTrustMe:[] = [];
  let personsITrust:[] = [];

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
    personsITrust = Object.keys(t2).map(k => t2[k]);
  }

  init();
</script>

<b class="m-4 text-primary">People that trust me:</b>
{#each personsThatTrustMe as personThatTrustMe}
  <div class="mx-4 mb- 2">
    <div class="flex w-full bg-white border border-gray-300 rounded">
      <div class="flex-1 px-4 py-2 text-base">
        <b class="text-primary">{personThatTrustMe.owner.address}</b>
      </div>
    </div>
  </div>
{/each}

<b class="m-4 text-primary">People I trust:</b>
{#each personsITrust as personITrust}
  <div class="mx-4 mb- 2">
    <div class="flex w-full bg-white border border-gray-300 rounded">
      <div class="flex-1 px-4 py-2 text-base">
        <b class="text-primary">{personITrust.owner.address}</b>
      </div>
    </div>
  </div>
{/each}
