<script lang="ts">
  import { CirclesHub } from "src/libs/o-circles-protocol/circles/circlesHub";
  import { Person } from "src/libs/o-circles-protocol/model/person";
  import { config } from "src/libs/o-circles-protocol/config";
  import { Jumper } from "svelte-loading-spinners";

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

<div class="m-4 space-y-2">
  <div class="flex w-full bg-white border border-gray-300 rounded">
    <img
      src="https://avatars.dicebear.com/api/human/mutual.svg"
      alt="profile"
      class="h-12" />
    <div class="flex-1 px-2 py-2 text-base">
      <div class="text-xs text-primary">0x123456789AbCDeFGHIj...</div>
      <p class="text-xs text-gray-500">
        <i class="fas fa-exchange-alt" /><span class="ml-2">mutual trust</span>
      </p>
    </div>
    <div class="flex items-center content-end justify-center">
      <div
        class="flex items-center content-end justify-center w-12 h-12 p-3 border-l border-gray-300 rounded ">
        <img src="icons/removeTrust.svg" alt="add" />
      </div>
      <div
        class="flex items-center content-end justify-center w-12 h-12 p-3 border-l border-gray-300 rounded ">
        <img src="icons/send.svg" alt="add" />
      </div>
    </div>
  </div>

  <!-- 
{#if address === mySafeAddress}
  <b class="m-4 text-primary">People that trust me:</b><br />
{:else}<br class="m-4 text-primary" />People that trust {address}:<br />{/if} -->
  {#each personsThatTrustMe as personThatTrustMe}
    <div class="flex w-full bg-white border border-gray-300 rounded">
      <img
        src="https://avatars.dicebear.com/api/human/{personThatTrustMe.owner.address}.svg"
        alt="profile"
        class="h-12" />
      <div class="flex-1 px-2 py-2 text-base">
        {#if !personThatTrustMe.limit || personThatTrustMe.limit == 0}
          <div class="text-xs text-gray-300">
            <!-- <a href="#/wallet/{personThatTrustMe.owner.address}/trusts"> -->
            {personThatTrustMe.owner.address.slice(0, 20)}...

            <!-- </a> -->
          </div>
          <p class="text-xs text-gray-500">
            <i class="fas fa-arrow-right" /><span class="ml-2">trusts you -
              trusted by 10 friends</span>
          </p>
        {:else}
          <div class="text-xs text-primary">
            <!-- <a href="#/wallet/{personThatTrustMe.owner.address}/trusts"> -->
            {personThatTrustMe.owner.address.slice(0, 20)}...

            <!-- </a> -->
          </div>
          <p class="text-xs text-gray-500">
            <i class="fas fa-arrow-right" /><span class="ml-2">trusts you
            </span>
          </p>
        {/if}
      </div>
      <div class="flex items-center content-end justify-center">
        <div
          class="flex items-center content-end justify-center w-12 h-12 p-3 border-l border-gray-300 rounded ">
          <img src="icons/addTrust.svg" alt="add" />
        </div>
        <div
          class="flex items-center content-end justify-center w-12 h-12 p-3 border-l border-gray-300 rounded ">
          <img src="icons/send.svg" alt="add" />
        </div>
      </div>
    </div>
  {/each}
  <!-- 
{#if address === mySafeAddress}
  <b class="m-4 text-primary">People I trust:</b>
{:else}<b class="m-4 text-primary">People that {address} trusts:</b>{/if} -->
  {#each personsITrust as personITrust}
    <div class="flex w-full bg-white border border-gray-300 rounded">
      <img
        src="https://avatars.dicebear.com/api/human/{personITrust.owner.address}.svg"
        alt="profile"
        class="h-12" />
      <div class="flex-1 px-2 py-2 text-base">
        {#if !personITrust.limit || personITrust.limit == 0}
          <div class="text-xs text-gray-300">
            <!-- <a href="#/wallet/{personITrust.owner.address}/trusts"> -->
            {personITrust.owner.address.slice(0, 20)}...

            <!-- </a> -->
          </div>
          <p class="text-xs text-gray-500">
            <i class="fas fa-arrow-right" /><span class="ml-2">trusts you -
              trusted by 10 friends</span>
          </p>
        {:else}
          <div class="text-xs text-primary">
            <!-- <a href="#/wallet/{personITrust.owner.address}/trusts"> -->
            {personITrust.owner.address.slice(0, 20)}...

            <!-- </a> -->
          </div>
          <p class="text-xs text-gray-500">
            <i class="fas fa-arrow-left" /><span class="ml-2">trusted by you</span>
          </p>
        {/if}
      </div>
      <div class="flex items-center content-end justify-center">
        <div
          class="flex items-center content-end justify-center w-12 h-12 p-3 border-l border-gray-300 rounded ">
          <img src="icons/removeTrust.svg" alt="add" />
        </div>
      </div>
    </div>
  {/each}
</div>
