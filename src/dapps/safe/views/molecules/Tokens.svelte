<script lang="ts">
  import { CirclesHub } from "src/libs/o-circles-protocol/circles/circlesHub";
  import { Person } from "src/libs/o-circles-protocol/model/person";
  import { config } from "src/libs/o-circles-protocol/config";
  import { Jumper } from "svelte-loading-spinners";
  import TokenItem from "src/libs/o-views/molecules/TokenItem.svelte";
  import { BN } from "ethereumjs-util";
  import CategoryTitle from "src/libs/o-views/atoms/CategoryTitle.svelte";
  import {Subscription} from "rxjs";
  import {OmoEvent} from "../../../../libs/o-events/omoEvent";
  import {onDestroy, onMount} from "svelte";

  let accountAddress: string;
  let safeAddress: string;

  let balance: BN;
  let circlesBalance: string;

  let safeEthBalance: BN;
  let safeEtherBalance: string;

  let personalEthBalance: BN;
  let personalEtherBalance: string;

  let person: Person;
  let tokensITrust: any[] = [];

  async function init() {
    const safe = await window.o.safe();
    safeAddress = safe.address;
    accountAddress = safe.owner;
    const hubAddress = config.getCurrent().HUB_ADDRESS;
    const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);

    person = new Person(circlesHub, safeAddress);

    reload();
  }

  async function reload() {
    const web3 = config.getCurrent().web3();
    const safe = await window.o.safe()

    balance = await person.getTokenBalance();
    const balanceStr = web3.utils.fromWei(balance, "ether");
    const dot = balanceStr.indexOf(".");
    circlesBalance = balanceStr.slice(0, dot + 3);

    safeEthBalance = await person.getEthBalance();
    const ethBalanceStr = web3.utils.fromWei(safeEthBalance, "ether");
    const ethDot = ethBalanceStr.indexOf(".");
    safeEtherBalance = ethBalanceStr.slice(0, ethDot + 7);

    personalEthBalance = await web3.eth.getBalance(safe.owner);
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
          data: {
            image:
              "https://avatars.dicebear.com/api/avataaars/" +
              token.owner.address +
              ".svg ",
            balanceBN: token.balance,
            title: token.owner.address.slice(0, 8),
            description: token.owner.address,
            balance: parseFloat(token.balanceString),
            subtitle: "CRC",
          },
        };
      });
    tokensITrust.sort((a, b) => -a.balanceBN.cmp(b.balanceBN));
  }


  let subscription: Subscription = window.o.shellEvents.subscribe((event: OmoEvent) =>
    {
      if (event.type === "shell.refreshView")
      {
        init();
      }
    });

  onDestroy(() =>
  {
    if (!subscription)
      return;

    subscription.unsubscribe();
    subscription = null;
  });

  onMount(() => init());

  $: circlesSafe = {
    data: {
      image: "images/logo/circles.svg",
      title: "Safe Circles",
      description: safeAddress,
      balance: parseFloat(circlesBalance),
      subtitle: "Account: Safe",
    },
  };
  $: xDaiSafe = {
    data: {
      image: "images/logo/xdai.png",
      title: "Safe xDai",
      description: safeAddress,
      balance: parseFloat(safeEtherBalance),
      subtitle: "Account: Safe",
    },
  };
  $: xDaiOwner = {
    data: {
      image: "images/logo/xdai.png",
      title: "SafeOwner xDai",
      description: accountAddress,
      balance: parseFloat(personalEtherBalance),
      subtitle: "Account: SafeOwner",
    },
  };

  const labelBalances = {
    data: {
      label: "currency balances",
    },
  };
  const labelDistribution = {
    data: {
      label: "detailed circles distribution",
    },
  };
</script>

<div>
  <div class="mb-4">
    <CategoryTitle mapping={labelBalances} />
  </div>
  <div class="mb-4 space-y-2">
    {#if circlesBalance || safeEtherBalance}
      <TokenItem mapping={circlesSafe} />
      <TokenItem mapping={xDaiSafe} />
      <TokenItem mapping={xDaiOwner} />
    {:else}
      <div class="flex items-center justify-center h-full mx-auto">
        <Jumper size="150" color="#071D69" unit="px" />
      </div>
    {/if}
  </div>
  <div class="mb-4">
    <CategoryTitle mapping={labelDistribution} />
  </div>
  <div class="mb-4 space-y-2">
    {#if tokensITrust.length > 0}
      {#each tokensITrust as token}
        <TokenItem mapping={token} />
      {/each}
    {:else}
      <div class="flex items-center justify-center h-full mx-auto">
        <Jumper size="150" color="#071D69" unit="px" />
      </div>
    {/if}
  </div>
</div>
