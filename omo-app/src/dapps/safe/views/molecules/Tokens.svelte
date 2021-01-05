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
  import {CirclesToken} from "../../../../libs/o-circles-protocol/model/circlesToken";
  import {Contact} from "../../../../libs/o-circles-protocol/model/contact";

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
      balance: Math.floor(parseFloat(web3.utils.fromWei(safeState.mySafeXDaiBalance)) * 10),
      subtitle: "Invites you have left",
      description: "xDai balance: " + parseFloat(web3.utils.fromWei(safeState.mySafeXDaiBalance)),
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
        const weiBalance = balanceList.map(o => o.balance.mul(new BN(3))).reduce((p, c) => p.add(c), new BN("0"));
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
            token.balance = balanceEntry.balance.mul(new BN(3));
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
    const balance = token.balance ? parseFloat(web3.utils.fromWei(token.balance)).toFixed(2) : "0";
    const listItem:{
      data: {
        image:string,
        balanceBN: BN,
        title: string,
        description: string,
        balance: string,
        subtitle: "time in ⦿",
      }
    } = {
      data: {
        image: "",
        balanceBN: new BN("0"),
        title: "",
        description: token.tokenOwner,
        balance: balance,
        subtitle: "time in ⦿",
      },
    };

    const contact = contacts[token.tokenOwner];
    if (contact && contact.omoProfile)
    {
      if (contact.omoProfile.avatar)
      {
        listItem.data.image = contact.omoProfile.avatar;
      }
      listItem.data.title = `${contact.omoProfile.profile.firstName} ${contact.omoProfile.profile.lastName}`
    }
    else if (contact && contact.circlesProfile)
    {
      listItem.data.image = contact.circlesProfile?.avatarUrl;
      listItem.data.title = contact.circlesProfile.username;
    }
    else
    {
      listItem.data.title = token.tokenOwner.slice(0, 8);
    }

    return listItem;
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
