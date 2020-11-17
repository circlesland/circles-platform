<script lang="ts">
  import { CirclesHub } from "src/libs/o-circles-protocol/circles/circlesHub";
  import { Person } from "src/libs/o-circles-protocol/model/person";
  import { config } from "src/libs/o-circles-protocol/config";
  import { Jumper } from "svelte-loading-spinners";
  import TokenItem from "src/libs/o-views/molecules/TokenItem.svelte";
  import { BN } from "ethereumjs-util";

  export let address: string;
  let balance: BN;
  let safeEthBalance: BN;
  let safeEtherBalance: string;
  let circlesBalance: string;

  let person: Person;
  let tokensITrust: any[] = [];

  function init(addr: string) {
    const hubAddress = config.getCurrent().HUB_ADDRESS;
    const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);

    person = new Person(circlesHub, addr);

    reload();
  }

  async function reload() {
    const web3 = config.getCurrent().web3();

    balance = await person.getTokenBalance();
    const balanceStr = web3.utils.fromWei(balance, "ether");
    const dot = balanceStr.indexOf(".");
    circlesBalance = balanceStr.slice(0, dot + 3);

    safeEthBalance = await person.getEthBalance();
    const ethBalanceStr = web3.utils.fromWei(safeEthBalance, "ether");
    const ethDot = ethBalanceStr.indexOf(".");
    safeEtherBalance = ethBalanceStr.slice(0, ethDot + 7);

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

  $: circles = {
    image: "images/logo/circles.svg",
    title: "Circles",
    description: "Circles I trust",
    balance: circlesBalance,
    currency: "CRC",
  };
  $: xDai = {
    image: "images/logo/xdai.png",
    title: "xDai",
    description: "1 invite or ~ 500 transactions",
    balance: safeEtherBalance,
    currency: "XDAI",
  };
</script>

<div class="py-2 font-bold text-gray-500">My currency balances</div>

<div class="space-y-2">
  {#if circlesBalance || safeEtherBalance}
    <TokenItem data={circles} />
    <TokenItem data={xDai} />
  {:else}
    <div class="flex items-center justify-center h-full mx-auto">
      <Jumper size="150" color="#071D69" unit="px" />
    </div>
  {/if}
</div>

<div class="py-2 font-bold text-gray-500">Trusted Circles I am holding</div>

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
