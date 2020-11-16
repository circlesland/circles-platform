<script lang="ts">
  import { CirclesHub } from "src/libs/o-circles-protocol/circles/circlesHub";
  import { Person } from "src/libs/o-circles-protocol/model/person";
  import { config } from "src/libs/o-circles-protocol/config";
  import { Jumper } from "svelte-loading-spinners";

  export let address: string;

  let person: Person;
  let tokensITrust: [] = [];

  function init(addr: string) {
    const hubAddress = config.getCurrent().HUB_ADDRESS;
    const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);

    person = new Person(circlesHub, addr);

    reload();
  }

  async function reload() {
    let t2 = await person.getTokenBalances();
    tokensITrust = Object.keys(t2)
      .map((k) => t2[k])
      .filter((o) => o.balanceString && o.balanceString !== "0");
    tokensITrust.sort((a, b) => -a.balance.cmp(b.balance));
  }

  $: {
    if (config.getCurrent().web3().utils.isAddress(address)) {
      init(address);
    }
  }
</script>

<style>
  .card {
    display: grid;
    grid-template-columns: 3.5rem 1fr auto;
    grid-template-rows: 3.5rem;
    width: 100%;
  }
</style>

<div class="py-2 font-bold text-secondary">My currencies</div>

<div class="space-y-2">
  <div class="bg-white border rounded card border-light-200">
    <div class="flex items-center justify-center p-2">
      <img src="images/logo/circles.svg" alt="CRC" />
    </div>
    <div class="p-2">
      <div class="text-base text-primary">Circles</div>
      <p class="-mt-1 text-xs text-gray-500">
        <span class="text-gray-500">Circles I trust</span>
      </p>
    </div>
    <div class="px-4 py-2 text-right">
      <div class="text-lg text-primary">248.32</div>
      <p class="-mt-1 text-xs text-gray-500">
        <span class="text-xs text-gray-500">CRC</span>
      </p>
    </div>
  </div>

  <div class="bg-white border rounded card border-light-200">
    <div class="flex items-center justify-center p-2">
      <img src="images/logo/xdai.png" alt="xDai" />
    </div>
    <div class="p-2">
      <div class="text-base text-primary">xDai</div>
      <p class="-mt-1 text-xs text-gray-500">
        <span class="text-gray-500">1 invite or ~ 500 transactions</span>
      </p>
    </div>
    <div class="px-4 py-2 text-right">
      <div class="text-lg text-primary">0.001232</div>
      <p class="-mt-1 text-xs text-gray-500">
        <span class="text-xs text-gray-500">xDAI</span>
      </p>
    </div>
  </div>
</div>

<div class="pt-4 pb-2 font-bold text-secondary">All my trusted Circles</div>

<div class="space-y-2">
  {#if tokensITrust.length > 0}
    {#each tokensITrust as token}
      <div class="bg-white border rounded card border-light-200">
        <div class="flex items-center justify-center p-2">
          <img
            src="https://avatars.dicebear.com/api/avataaars/{token.owner.address}.svg"
            alt="CRC" />
        </div>
        <div class="p-2">
          <div class="text-base text-primary">Circles</div>
          <p class="-mt-1 text-xs text-gray-500 ">
            <span class="text-gray-500">{token.owner.address}</span>
          </p>
        </div>
        <div class="px-4 py-2 text-right">
          <div class="text-lg text-primary">{token.balanceString}</div>
          <p class="-mt-1 text-xs text-gray-500 ">
            <span class="text-xs text-gray-500">CRC</span>
          </p>
        </div>
      </div>
    {/each}
  {:else}
    <div class="flex items-center justify-center h-full mx-auto">
      <Jumper size="150" color="#071D69" unit="px" />
    </div>
  {/if}
</div>

<!-- 
<div class="mb-2">
  <div class="flex w-full bg-white border border-gray-300 rounded">
    <img src="images/logo/logo.png" alt="CRC" class="p-2 h-14" />
    <div class="flex-1 w-2/3 px-4 py-2 ">
      <div class="text-base text-primary">
        Circles
        <i class="fas fa-check" />
      </div>
      <p class="-mt-1 text-xs text-gray-500">
        <span class="text-gray-500">Circles verfied by Omo</span>
      </p>
    </div>
    <div class="flex-1 w-1/3 px-4 py-2 text-right">
      <div class="text-lg text-primary">248.32</div>
      <p class="-mt-1 text-xs text-gray-500">
        <span class="text-xs text-gray-500">CRC</span>
      </p>
    </div>
  </div>
</div> -->

<!-- 
<div class="mb-2">
  <div class="flex w-full bg-white border border-gray-300 rounded">
    <img
      src="https://avatars.dicebear.com/api/avataaars/{token.owner.address}.svg"
      alt="profile"
      class="h-12 pt-1" />
    <div class="flex-1 w-2/3 px-4 py-2 text-sm">
      <div class="text-primary">
        <a
          href="#/wallet/{token.owner.address}/tokens">{token.owner.address.slice(0, 20)}...</a>
      </div>
      <p class="text-xs text-gray-500">
        <span class="text-gray-500">safe address of token creator</span>
      </p>
      <b class="text-primary">{token.token}</b>
      <p class="text-primary">
        {#if !token.limit || token.limit == 0}
          <b class="text-primary">
            <a
              href="#/wallet/{token.owner.address}/tokens"
              class="">{token.owner.address.slice(0, 25)}...</a>
          </b>
        {:else}
          <b class="text-primary">
            <span class="text-gray-500">safe address of owner:</span>
            <a
              href="#/wallet/{token.owner.address}/tokens">{token.owner.address.slice(0, 25)}...</a>
          </b>
        {/if}
      </p>
    </div>
    <div class="w-1/3 h-12 px-3 py-1 text-3xl text-right text-primary">
      {token.balanceString}
    </div>
  </div>
</div> -->
