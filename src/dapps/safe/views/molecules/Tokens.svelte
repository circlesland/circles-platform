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
  import { ProcessEnvironment } from "../../../../libs/o-processes/interfaces/processEnvironment";
  import {tryGetDappState} from "../../../../libs/o-os/loader";
  import {CirclesTransaction, OmoSafeState, Token} from "../../manifest";
  import {OmoSapienState} from "../../../omosapien/manifest";
  import {FissionAuthState} from "../../../fissionauth/manifest";


  let safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  let knownTokensSubscription: Subscription;
  let knownTokens: Token[] = [];
  let omosapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");

  const web3 = config.getCurrent().web3();
  const myAccountAddress = web3.eth.accounts.privateKeyToAccount(safeState.myKey.privateKey).address;


  let accountxDai = {
    data: {
      image: "logos/xdai.svg",
      title: "Transaction Credits",
      subtitle: "Estimated transactions you have left",
      balance: "~" + Math.floor(parseFloat(web3.utils.fromWei(safeState.myAccountXDaiBalance)) * 20000),
      description: "xDai balance: " + parseFloat(web3.utils.fromWei(safeState.myAccountXDaiBalance)),
    }
  };

  let safexDai = {
    data: {
      image: "logos/omo.svg",
      title: "Invite Credits",
      balance: Math.floor(parseFloat(web3.utils.fromWei(safeState.myAccountXDaiBalance)) * 10),
      subtitle: "Invites you have left",
      description: "xDai balance: " + parseFloat(web3.utils.fromWei(safeState.myAccountXDaiBalance)),
    }
  };

  let safeCirclesBalance = {
    data: {
      image: "symbols/o.svg",
      title: "time in ⦿",
      description: "Address: " + safeState.mySafeAddress,
      balance: (parseFloat("0") * 3).toFixed(2),
      subtitle: "hours in your safe account",
    }
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

  function init()
  {
    if (knownTokensSubscription)
    {
      knownTokensSubscription.unsubscribe();
      knownTokensSubscription = null;
    }

    safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

    if (safeState.myContacts)
    {
      knownTokensSubscription = safeState.myKnownTokens.subscribe(tokenList => {
        knownTokens = Object.values(tokenList);
      });
    }

    console.log("MyKnownTokens:", knownTokens);
  }

  function mapToListItem(token:Token)
  {
    return {
      data: {
        image:
          (token.ownerSafeAddress == safeState.mySafeAddress
            ? omosapienState.myProfile?.avatar
            : null)
          ?? `https://avatars.dicebear.com/api/avataaars/${token.ownerSafeAddress}.svg`,
          balanceBN: new BN("0"),
          title: token.ownerSafeAddress == safeState.mySafeAddress
                  ? `${omosapienState.myProfile.firstName} ${omosapienState.myProfile.lastName}`
                  : token.ownerSafeAddress.slice(0, 8),
          description: token.ownerSafeAddress,
          balance: (parseFloat("0") * 3).toFixed(2),
          subtitle: "time in ⦿",
      },
    }
  }

  onDestroy(() => {
    if (!knownTokensSubscription) return;

    knownTokensSubscription.unsubscribe();
    knownTokensSubscription = null;
  });

  onMount(() => init());
</script>

<div>
  <div class="mb-4">
    <CategoryTitle mapping={labelBalances} />
  </div>
  <div class="mb-4 space-y-2">
      <TokenItem mapping={safeCirclesBalance} />
      <TokenItem mapping={safexDai} />
      <TokenItem mapping={accountxDai} />
  </div>
  <div class="mb-4">
    <CategoryTitle mapping={labelDistribution} />
  </div>
  <div class="mb-4 space-y-2">
    {#if knownTokens.length > 0}
      {#each knownTokens as token}
        <TokenItem mapping={mapToListItem(token)} />
      {/each}
    {:else}
      <div class="flex items-center justify-center h-full mx-auto">
        <Jumper size="150" color="#071D69" unit="px" />
      </div>
    {/if}
  </div>
</div>
