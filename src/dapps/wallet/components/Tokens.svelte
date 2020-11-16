<script lang="ts">
  import { CirclesHub } from "src/libs/o-circles-protocol/circles/circlesHub";
  import { Person } from "src/libs/o-circles-protocol/model/person";
  import { config } from "src/libs/o-circles-protocol/config";
  import { Jumper } from "svelte-loading-spinners";
  import TokenItem from "src/libs/o-views/molecules/TokenItem.svelte";

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
      .filter((o) => o.balanceString && o.balanceString !== "0")
      .map((token) => {
        return {
          image:
            "https://avatars.dicebear.com/api/avataaars/" +
            token.owner.address +
            ".svg ",
          title: token.owner.address.slice(0, 8),
          description: token.owner.address,
          balance: token.balanceString,
          currency: "CRC",
        };
      });
    tokensITrust.sort((a, b) => -a.balance.cmp(b.balance));
  }

  $: {
    if (config.getCurrent().web3().utils.isAddress(address)) {
      init(address);
    }
  }

  let circles = {
    image: "images/logo/circles.svg",
    title: "Circles",
    description: "Circles I trust",
    balance: "34.23",
    currency: "CRC",
  };
  let xDai = {
    image: "images/logo/xdai.png",
    title: "xDai",
    description: "1 invite or ~ 500 transactions",
    balance: "0.001232",
    currency: "XDAI",
  };
</script>

<div class="py-2 font-bold text-secondary">My currencies</div>

<div class="space-y-2">
  <TokenItem data={circles} />
  <TokenItem data={xDai} />
</div>

<div class="pt-4 pb-2 font-bold text-secondary">All my trusted Circles</div>

<div class="space-y-2">
  {#if tokensITrust.length > 0}
    {#each tokensITrust as token}
      <TokenItem data={token} />
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
