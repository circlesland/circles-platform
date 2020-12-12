<script lang="ts">
  import { CirclesHub } from "src/libs/o-circles-protocol/circles/circlesHub";
  import { HubAccount } from "src/libs/o-circles-protocol/model/hubAccount";
  import { config } from "src/libs/o-circles-protocol/config";
  import { Jumper } from "svelte-loading-spinners";
  import TokenItem from "src/libs/o-views/molecules/TokenItem.svelte";
  import { BN } from "ethereumjs-util";
  import CategoryTitle from "src/libs/o-views/atoms/CategoryTitle.svelte";
  import { Subscription } from "rxjs";
  import { OmoEvent } from "../../../../libs/o-events/omoEvent";
  import { onDestroy, onMount } from "svelte";
  import { getEnvironment } from "../../../../libs/o-os/o";
  import { ProcessEnvironment } from "../../../../libs/o-processes/interfaces/processEnvironment";

  let accountAddress: string;
  let safeAddress: string;

  let balance: BN;
  let circlesBalance: string;

  let safeEthBalance: BN;
  let safeEtherBalance: string;

  let personalEthBalance: BN;
  let personalEtherBalance: string;

  let person: HubAccount;
  let tokensITrust: any[] = [];

  let environment: ProcessEnvironment;

  async function init() {
    environment = await getEnvironment();
    safeAddress = environment.me.mySafe?.address;
    accountAddress = environment.me.myAddress;
    const hubAddress = config.getCurrent().HUB_ADDRESS;
    const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);

    if (safeAddress) {
      person = new HubAccount(circlesHub, safeAddress);
    }

    reload();
  }

  function formatBn(value: BN, decimalPlaces: number = 3) {
    const balanceStr = environment.eth.web3.utils.fromWei(value, "ether");
    const dot = balanceStr.indexOf(".");
    return balanceStr.slice(0, dot + decimalPlaces);
  }

  async function reload() {
    if (safeAddress) {
      balance = await person.getTokenBalance();
      circlesBalance = formatBn(balance);

      safeEthBalance = environment.me.mySafeXDaiBalance;
      safeEtherBalance = formatBn(safeEthBalance, 7);
    }

    personalEthBalance = environment.me.myAddressXDaiBalance;
    personalEtherBalance = formatBn(personalEthBalance, 7);

    if (safeAddress) {
      let t2 = await person.getTokenBalances();
      tokensITrust = Object.keys(t2)
        .map((k) => t2[k])
        .filter((o) => o.balanceString && o.balanceString !== "0")
        .map((token) => {
          return {
            data: {
              image:
                (token.owner.address == safeAddress
                  ? environment.me.myProfile?.avatar
                  : null) ??
                "https://avatars.dicebear.com/api/avataaars/" +
                  token.owner.address +
                  ".svg ",
              balanceBN: token.balance,
              title:
                (token.owner.address == safeAddress
                  ? environment.me.myDisplayName()
                  : null) ?? token.owner.address.slice(0, 8),
              description: token.owner.address,
              balance: (parseFloat(token.balanceString) * 3).toFixed(2),
              subtitle: "time in ⦿",
            },
          };
        });
      tokensITrust.sort((a, b) => -a.data.balanceBN.cmp(b.data.balanceBN));
    }
  }

  let subscription: Subscription = window.o.events.subscribe(
    (event: OmoEvent) => {
      if (event.type === "shell.refreshView") {
        init();
      }
    }
  );

  onDestroy(() => {
    if (!subscription) return;

    subscription.unsubscribe();
    subscription = null;
  });

  onMount(() => init());

  $: circlesSafe = {
    data: {
      image: "symbols/o.svg",
      title: "time in ⦿",
      description: "Address: " + safeAddress,
      balance: (parseFloat(circlesBalance) * 3).toFixed(2),
      subtitle: "hours in your safe account",
    },
  };
  $: xDaiSafe = {
    data: {
      image: "logos/omo.svg",
      title: "Invite Credits",
      balance: Math.floor(parseFloat(safeEtherBalance) * 10),
      subtitle: "Invites you have left",
      description: "xDai balance: " + parseFloat(safeEtherBalance),
    },
  };

  $: xDaiOwner = {
    data: {
      image: "logos/xdai.svg",
      title: "Transaction Credits",
      subtitle: "Estimated transactions you have left",
      balance: "~" + Math.floor(parseFloat(personalEtherBalance) * 20000),
      description: "xDai balance: " + parseFloat(personalEtherBalance),
    },
  };

  const labelBalances = {
    data: {
      label: "currency balances",
    },
  };

  const labelDistribution = {
    data: {
      label: "detailed ⦿ distribution",
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
