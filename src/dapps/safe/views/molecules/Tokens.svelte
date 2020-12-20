<script lang="ts">
  import { config } from "src/libs/o-circles-protocol/config";
  import { Jumper } from "svelte-loading-spinners";
  import TokenItem from "src/libs/o-views/molecules/TokenItem.svelte";
  import { BN } from "ethereumjs-util";
  import CategoryTitle from "src/libs/o-views/atoms/CategoryTitle.svelte";
  import { Subscription } from "rxjs";
  import { onDestroy, onMount } from "svelte";
  import {tryGetDappState} from "../../../../libs/o-os/loader";

  import {OmoSapienState} from "../../../omosapien/manifest";
  import {OmoSafeState} from "../../manifest";
  import {CirclesToken} from "../../../../libs/o-circles-protocol/queryModel/circlesToken";
  import {Contact} from "../../../../libs/o-circles-protocol/queryModel/contact";

  let safeState:OmoSafeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  let balanceSubscriptions: Subscription;
  let balances: CirclesToken[] = [];
  let contacts: {[safeAddress:string]:Contact} = {};
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

  function formatBN(bn:BN)
  {
    return parseFloat(web3.utils.fromWei(bn)).toFixed(2);
  }

  function init()
  {
    if (balanceSubscriptions)
    {
      balanceSubscriptions.unsubscribe();
      balanceSubscriptions = null;
    }

    safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

    contacts = {};
    safeState.myContacts.subscribe(contactList =>
    {
      const newContacts = contactList.filter(contact => !contacts[contact.safeAddress]);
      if (newContacts.length == 0)
      {
        return;
      }

      newContacts.forEach(contact => {
        contacts[contact.safeAddress] = contact;
      });

      contacts = contacts;
    });

    if (safeState.myBalances)
    {
      balanceSubscriptions = safeState.myBalances.subscribe(balanceList =>
      {
        const weiBalance = balanceList.map(o => o.balance).reduce((p, c) => p.add(c), new BN("0"));
        safeCirclesBalance = {
          data: {
            image: "symbols/o.svg",
            title: "time in ⦿",
            description: "Address: " + safeState.mySafeAddress,
            balance: parseFloat(web3.utils.fromWei(weiBalance)).toFixed(2),
            subtitle: "hours in your safe account",
          }
        };

        balances = balanceList.map(balanceEntry => {
          const tokens:CirclesToken[] = Object.values(safeState.myKnownTokens.getValue());
          const token = tokens.find(t => t.tokenAddress == balanceEntry.tokenAddress);
          if (token)
          {
            token.balance = balanceEntry.balance;
          }
          return token;
        }).filter(o => !!o);
      });
    }
  }

  onDestroy(() => {
    if (!balanceSubscriptions) return;

    balanceSubscriptions.unsubscribe();
    balanceSubscriptions = null;
  });

  onMount(() => init());

  function mapToListItem(token:CirclesToken)
  {
    const image = contacts[token.tokenOwner]?.circlesProfile?.avatarUrl
      ?? "https://avatars.dicebear.com/api/avataaars/" + token.tokenOwner + ".svg";

    const title = contacts[token.tokenOwner]?.circlesProfile?.username
      ??  token.tokenAddress.slice(0, 8);

    const balance = token.balance ? parseFloat(web3.utils.fromWei(token.balance)).toFixed(2) : "0";
    return {
      data: {
        image:image,
          balanceBN: new BN("0"),
          title: title,
          description: token.tokenOwner,
          balance: balance,
          subtitle: "time in ⦿",
      },
    }
  }

  onDestroy(() => {
    if (!balanceSubscriptions) return;

    balanceSubscriptions.unsubscribe();
    balanceSubscriptions = null;
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
    {#if balances.length > 0}
      {#each balances as token}
        <TokenItem mapping={mapToListItem(token)} />
      {/each}
    {:else}
      <div class="flex items-center justify-center h-full mx-auto">
        <Jumper size="150" color="#071D69" unit="px" />
      </div>
    {/if}
  </div>
</div>
