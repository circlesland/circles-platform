<script lang="ts">
  import { CirclesHub } from "../../../libs/o-circles-protocol/circles/circlesHub";
  import { Person } from "../../../libs/o-circles-protocol/model/person";
  import { config } from "../../../libs/o-circles-protocol/config";
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

{#if address === mySafeAddress}
  <b class="m-4 text-primary">People that trust me:</b>
{:else}<b class="m-4 text-primary">People that trust {address}:</b>{/if}
{#each personsThatTrustMe as personThatTrustMe}
  <div class="mx-4 mb-2">
    <div class="flex w-full bg-white border border-gray-300 rounded">
      <img
        src="https://avatars.dicebear.com/api/human/{personThatTrustMe.owner.address}.svg"
        alt="profile"
        class="h-16" />
      <div class="flex-1 px-4 py-2 text-base">
        {#if !personThatTrustMe.limit || personThatTrustMe.limit == 0}
          <b class="text-xs text-gray-300">
            <!-- <a href="#/wallet/{personThatTrustMe.owner.address}/trusts"> -->
            {personThatTrustMe.owner.address.slice(0, 20)}...

            <!-- </a> -->
          </b>
          <p class="text-xs text-gray-500">
            <i class="fas fa-arrow-right" /><span class="ml-2">trusts you -
              trusted by 10 friends</span>
          </p>
        {:else}
          <b class="text-xs text-primary">
            <!-- <a href="#/wallet/{personThatTrustMe.owner.address}/trusts"> -->
            {personThatTrustMe.owner.address.slice(0, 20)}...

            <!-- </a> -->
          </b>
          <p class="text-xs text-gray-500">
            <i class="fas fa-arrow-right" /><span class="ml-2">trusts you
            </span>
          </p>
        {/if}
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
        alt="profile"
        class="h-16" />
      <div class="flex-1 px-4 py-2 text-base">
        {#if !personITrust.limit || personITrust.limit == 0}
          <b class="text-xs text-gray-300">
            <!-- <a href="#/wallet/{personITrust.owner.address}/trusts"> -->
            {personITrust.owner.address.slice(0, 20)}...

            <!-- </a> -->
          </b>
          <p class="text-xs text-gray-500">
            <i class="fas fa-arrow-right" /><span class="ml-2">trusts you -
              trusted by 10 friends</span>
          </p>
        {:else}
          <b class="text-xs text-primary">
            <!-- <a href="#/wallet/{personITrust.owner.address}/trusts"> -->
            {personITrust.owner.address.slice(0, 20)}...

            <!-- </a> -->
          </b>
          <p class="text-xs text-gray-500">
            <i class="fas fa-arrow-left" /><span class="ml-2">trusted by you</span>
          </p>
        {/if}
      </div>
    </div>
  </div>
{/each}

<!-- <div class="m-4 space-y-2">
    <div class="font-bold text-primary">Design placeholder for daniel</div>

    <div class="flex w-full space-x-2 h-14">
      <div
        class="flex items-center justify-center bg-white border border-gray-300 rounded w-14 h-14">
        <img
          src="https://avatars.dicebear.com/api/human/2.svg"
          alt="profile"
          class="w-12" />
      </div>
      <div class="flex flex-1 bg-white border border-gray-300 rounded">
        <div class="flex-1">
          <div class="flex items-center px-4 h-14">
            <div>
              <b class="text-sm leading-none text-primary">0x7698689d...</b>
              <p class="text-xs text-gray-500 ">
                <i class="fas fa-heart text-primary" /><span class="pr-1" /><i
                  class="fas fa-heart text-primary" /><span class="ml-2">mutual
                  trust</span>
              </p>
            </div>
          </div>
        </div>
        <div class="flex items-center content-end justify-center">
          <div
            class="flex items-center content-end justify-center p-3 border-l border-gray-300 rounded h-14 w-14 ">
            <img src="icons/send.svg" alt="add" />
          </div>
        </div>
      </div>
    </div>

    <div class="flex w-full space-x-2 h-14">
      <div
        class="flex items-center justify-center bg-white border border-gray-300 rounded w-14 h-14">
        <img
          src="https://avatars.dicebear.com/api/human/3.svg"
          alt="profile"
          class="w-12" />
      </div>
      <div class="flex flex-1 bg-white border border-gray-300 rounded">
        <div class="flex-1">
          <div class="flex items-center px-4 h-14">
            <div>
              <b class="-mt-1 text-sm text-primary">0x769a8689d...</b>
              <p class="-mt-1 text-xs text-gray-500 ">
                <i class="fas fa-heart text-primary" /><span class="pr-1" /><i
                  class="fas fa-heart" /><span class="ml-2">trusts you</span>
              </p>
            </div>
          </div>
        </div>
        <div class="flex items-center content-end justify-center">
          <div
            class="flex items-center justify-center p-4 text-white border-l border-gray-300 rounded-r h-14 w-14">
            <img src="icons/addTrust.svg" alt="send" />
          </div>
        </div>
      </div>
    </div>

    <div class="flex w-full space-x-2 h-14">
      <div
        class="flex items-center justify-center bg-white border border-gray-300 rounded w-14 h-14">
        <img
          src="https://avatars.dicebear.com/api/human/4.svg"
          alt="profile"
          class="w-12" />
      </div>
      <div class="flex flex-1 bg-white border border-gray-300 rounded">
        <div class="flex-1">
          <div class="flex items-center px-4 h-14">
            <div>
              <b class="text-sm text-primary">0x769a8689d...</b>
              <p class="text-xs text-gray-500 ">
                <i class="fas fa-heart " /><span class="pr-1" /><i
                  class="fas fa-heart text-primary" /><span class="ml-2">trusted
                  by you</span>
              </p>
            </div>
          </div>
        </div>
        <div class="flex items-center content-end justify-center">
          <div
            class="flex items-center justify-center p-4 text-white border-l border-gray-300 rounded-r h-14 w-14">
            <img src="icons/removeTrust.svg" alt="send" />
          </div>
        </div>
      </div>
    </div>
  </div> -->
