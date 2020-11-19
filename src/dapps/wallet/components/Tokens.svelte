<script lang="ts">
  import { CirclesHub } from "src/libs/o-circles-protocol/circles/circlesHub";
  import { Person } from "src/libs/o-circles-protocol/model/person";
  import { config } from "src/libs/o-circles-protocol/config";
  import { Jumper } from "svelte-loading-spinners";
  import TokenItem from "src/libs/o-views/molecules/TokenItem.svelte";
  import { BN } from "ethereumjs-util";

  export let address: string;
  let accountAddress: string = localStorage.getItem("omo.address");
  let safeAddress: string = localStorage.getItem("omo.safeAddress");

  let balance: BN;
  let circlesBalance: string;

  let safeEthBalance: BN;
  let safeEtherBalance: string;

  let personalEthBalance: BN;
  let personalEtherBalance: string;

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

    personalEthBalance = await web3.eth.getBalance(
      localStorage.getItem("omo.address")
    );
    const personalEthBalanceStr = web3.utils.fromWei(
      personalEthBalance,
      "ether"
    );
    const personalEthDot = personalEthBalanceStr.indexOf(".");
    personalEtherBalance = personalEthBalanceStr.slice(0, personalEthDot + 7);

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
          balanceBN: token.balance,
          title: token.owner.address.slice(0, 8),
          description: token.owner.address,
          balance: token.balanceString,
          currency: "CRC",
        };
      });
    tokensITrust.sort((a, b) => -a.balanceBN.cmp(b.balanceBN));
  }

  $: {
    if (config.getCurrent().web3().utils.isAddress(address)) {
      init(address);
    }
  }

  $: circlesSafe = {
    image: "images/logo/circles.svg",
    title: "Safe Circles",
    description: safeAddress,
    balance: circlesBalance,
    currency: "Account: Safe",
  };
  $: xDaiSafe = {
    image: "images/logo/xdai.png",
    title: "Safe xDai",
    description: safeAddress,
    balance: safeEtherBalance,
    currency: "Account: Safe",
  };
  $: xDaiOwner = {
    image: "images/logo/xdai.png",
    title: "SafeOwner xDai",
    description: accountAddress,
    balance: personalEtherBalance,
    currency: "Account: SafeOwner",
  };
</script>

<div class="pb-1 pl-1 text-gray-500 lowercase font-title">
  currency balances
</div>

<div class="space-y-2">
  {#if circlesBalance || safeEtherBalance}
    <TokenItem data={circlesSafe} />
    <TokenItem data={xDaiSafe} />
    <TokenItem data={xDaiOwner} />
  {:else}
    <div class="flex items-center justify-center h-full mx-auto">
      <Jumper size="150" color="#071D69" unit="px" />
    </div>
  {/if}
</div>

<div class="pt-4 pb-1 pl-1 text-gray-500 lowercase font-title">
  detailed circles distribution
</div>

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
