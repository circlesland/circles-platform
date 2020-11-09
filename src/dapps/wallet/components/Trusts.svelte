<script lang="ts">
  import { CirclesHub } from "../../../libs/o-circles-protocol/circles/circlesHub";
  import { Person } from "../../../libs/o-circles-protocol/model/person";
  import { config } from "../../../libs/o-circles-protocol/config";

  export let address: string;
  let mySafeAddress: string;

  let person: Person;
  let personsThatTrustMe: [] = [];
  let personsITrust: [] = [];

  function init(addr: string) {
    const hubAddress = config.getCurrent().HUB_ADDRESS;
    const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);
    mySafeAddress = localStorage.getItem("omo.safeAddress");

    person = new Person(circlesHub, addr);

    reload();
  }

  async function reload() {
    let t1 = await person.getPersonsThatTrustMe();
    personsThatTrustMe = Object.keys(t1).map((k) => t1[k]);

    let t2 = await person.getPersonsITrust();
    personsITrust = Object.keys(t2).map((k) => t2[k]);
  }

  $: {
    if (config.getCurrent().web3().utils.isAddress(address)) {
      init(address);
    }
  }
</script>

{#if address === mySafeAddress}
  <b class="m-4 text-primary">Mututal trust:</b>
  <div class="mx-4 mb-2">
    <div class="flex w-full bg-white border border-gray-300 rounded">
      <img src="https://avatars.dicebear.com/api/human/1.svg" class="h-16" />
      <div class="flex-1 px-4 py-2 text-base">
        <b class="text-xs text-primary">0x76asdfidtuadks</b>
        <p class="text-xs text-gray-500">
          <i class="fas fa-exchange-alt" /><span class="ml-2">mututal trust -
            trusted by 10 friends</span>
        </p>
      </div>
      <div class="w-12 h-16 px-4 py-5 text-white bg-gray-300">
        <i class="fas fa-minus" />
      </div>
    </div>
  </div>

  <b class="m-4 text-primary">People that trust me:</b>
{:else}<b class="m-4 text-primary">People that trust {address}:</b>{/if}
{#each personsThatTrustMe as personThatTrustMe}
  <div class="mx-4 mb-2">
    <div class="flex w-full bg-white border border-gray-300 rounded">
      <img
        src="https://avatars.dicebear.com/api/human/{personThatTrustMe.owner.address}.svg"
        class="h-16" />
      <div class="flex-1 px-4 py-2 text-base">
        {#if !personThatTrustMe.limit || personThatTrustMe.limit == 0}
          <b class="text-xs text-gray-300"><a
              href="#/wallet/{personThatTrustMe.owner.address}/trusts">{personThatTrustMe.owner.address}</a></b>
          <p class="text-xs text-gray-500">
            <i class="fas fa-arrow-right" /><span class="ml-2">trusts you -
              trusted by 10 friends</span>
          </p>
        {:else}
          <b class="text-xs text-primary"><a
              href="#/wallet/{personThatTrustMe.owner.address}/trusts">{personThatTrustMe.owner.address}</a></b>
          <p class="text-xs text-gray-500">
            <i class="fas fa-arrow-right" /><span class="ml-2">trusts you -
              trusted by 10 friends</span>
          </p>
        {/if}
      </div>
      <div class="w-12 h-16 px-4 py-5 text-white bg-action">
        <i class="fas fa-plus" />
      </div>
    </div>
  </div>
{/each}

{#if address === mySafeAddress}
  <b class="m-4 text-primary">People I trust:</b>
{:else}<b class="m-4 text-primary">People that {address} trusts:</b>{/if}
{#each personsITrust as personITrust}
  <div class="mx-4 mb-2">
    <div class="flex w-full bg-white border border-gray-300 rounded">
      <img
        src="https://avatars.dicebear.com/api/human/{personITrust.owner.address}.svg"
        class="h-16" />
      <div class="flex-1 px-4 py-2 text-base">
        {#if !personITrust.limit || personITrust.limit == 0}
          <b class="text-xs text-gray-300"><a
              href="#/wallet/{personITrust.owner.address}/trusts">{personITrust.owner.address}</a></b>
          <p class="text-xs text-gray-500">
            <i class="fas fa-arrow-right" /><span class="ml-2">trusts you -
              trusted by 10 friends</span>
          </p>
        {:else}
          <b class="text-xs text-primary"><a
              href="#/wallet/{personITrust.owner.address}/trusts">{personITrust.owner.address}</a></b>
          <p class="text-xs text-gray-500">
            <i class="fas fa-arrow-left" /><span class="ml-2">trusted by you -
              trusted by 10 friends</span>
          </p>
        {/if}
      </div>
      <div class="w-12 h-16 px-4 py-5 text-white bg-gray-300">
        <i class="fas fa-minus" />
      </div>
    </div>
  </div>
{/each}
