<script lang="ts">
  import TokenItem from "src/libs/o-views/molecules/TokenItem.svelte";
  import {BN} from "ethereumjs-util";
  import CategoryTitle from "src/libs/o-views/atoms/CategoryTitle.svelte";
  import {onDestroy, onMount} from "svelte";

  import {OmoSapienState} from "../../../omosapien/manifest";
  import {OmoSafeState} from "../../manifest";
  import {CirclesToken} from "omo-circles/dist/model/circlesToken";
  import {Contact} from "omo-models/dist/omo/contact";
  import {config} from "omo-circles/dist/config";
  import {OmoSubscription} from "omo-quirks/dist/OmoSubscription";
  import {tryGetDappState} from "omo-kernel/dist/kernel";
  import LoadingSpinner from "../../../../libs/o-views/atoms/LoadingSpinner.svelte";

  let safeState: OmoSafeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  let balanceSubscriptions: OmoSubscription;
  let balances: CirclesToken[] = [];
  let contacts: { [safeAddress: string]: Contact } = {};
  let omosapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");

  const web3 = config.getCurrent().web3();
  const myAccountAddress = web3.eth.accounts.privateKeyToAccount(
    safeState.myKey.privateKey
  ).address;

  let accountxDai = {
    data: {
      image: "logos/xdai.svg",
      title: "Transaction Credits",
      subtitle: "Estimated transactions you have left",
      balance:
        "~" +
        Math.floor(
          parseFloat(web3.utils.fromWei(safeState.myAccountXDaiBalance)) * 20000
        ),
      description:
        "xDai balance on your safe owner key: " +
        parseFloat(web3.utils.fromWei(safeState.myAccountXDaiBalance)),
    },
  };

  let safexDai = {
    data: {
      image: "logos/xdai.svg",
      title: "xDai",
      balance: Math.floor(
        parseFloat(web3.utils.fromWei(safeState.mySafeXDaiBalance))
      ),
      subtitle: "1 xDai ~ 1 USD",
      description:
        "xDai balance on safe: " +
        parseFloat(web3.utils.fromWei(safeState.mySafeXDaiBalance)),
    },
  };

  let safeCirclesBalance = {
    data: {
      image: "logos/circles.png",
      title: "Circles",
      description: "Address: " + safeState.mySafeAddress,
      balance: "0",
      subtitle: "Circles in your safe account",
    },
  };

  const labelBalances = {
    data: {
      label: "currency balances",
    },
  };

  const labelDistribution = {
    data: {
      label: "detailed Circles distribution",
    },
  };

  function formatBN(bn: BN) {
    return parseFloat(web3.utils.fromWei(bn)).toFixed(2);
  }

  function init() {
    if (balanceSubscriptions) {
      balanceSubscriptions.unsubscribe();
      balanceSubscriptions = null;
    }

    safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

    contacts = {};
    safeState.myContacts.subscribe((contactList) => {
      const newContacts = contactList.payload.filter(
        (contact) => !contacts[contact.safeAddress]
      );
      if (newContacts.length == 0) {
        return;
      }

      newContacts.forEach((contact) => {
        contacts[contact.safeAddress] = contact;
      });

      contacts = contacts;
    });

    if (safeState.myBalances) {
      balanceSubscriptions = safeState.myBalances.subscribe((balanceList) => {
        const weiBalance = balanceList.payload
          .map((o) => o.balance)
          .reduce((p, c) => p.add(c), new BN("0"));
        safeCirclesBalance = {
          data: {
            image: "logos/circles.svg",
            title: "Circles",
            description: "Address: " + safeState.mySafeAddress,
            balance: parseFloat(web3.utils.fromWei(weiBalance)).toFixed(2),
            subtitle: "Circles in your safe account",
          },
        };

        balances = balanceList.payload
          .map((balanceEntry) => {
            const tokens: CirclesToken[] = Object.values(
              safeState.myKnownTokens.getValue().payload
            );
            const token = tokens.find(
              (t) => t.tokenAddress == balanceEntry.tokenAddress
            );
            if (token) {
              token.balance = balanceEntry.balance;
            }
            return token;
          })
          .filter((o) => !!o);
      });
    }
  }

  onDestroy(() => {
    if (!balanceSubscriptions) return;

    balanceSubscriptions.unsubscribe();
    balanceSubscriptions = null;
  });

  onMount(() => init());

  function mapToListItem(token: CirclesToken) {
    const balance = token.balance
      ? parseFloat(web3.utils.fromWei(token.balance)).toFixed(2)
      : "0";
    const listItem: {
      data: {
        image: string;
        balanceBN: BN;
        title: string;
        description: string;
        balance: string;
        subtitle: "Circles";
      };
    } = {
      data: {
        image: "",
        balanceBN: new BN("0"),
        title: "",
        description: token.tokenOwner,
        balance: balance,
        subtitle: "Circles",
      },
    };

    const contact = contacts[token.tokenOwner];
    if (contact && contact.omoProfile) {
      if (contact.omoProfile.avatarCid) {
        listItem.data.image = contact.omoProfile.avatarCid;
      }
      listItem.data.title = `${contact.omoProfile.profile.firstName} ${contact.omoProfile.profile.lastName}`;
    } else if (contact && contact.circlesProfile) {
      listItem.data.image = contact.circlesProfile?.avatarUrl;
      listItem.data.title = contact.circlesProfile.username;
    } else {
      listItem.data.title = token.tokenOwner.slice(0, 8);
    }

    if (!listItem.data.image) {
      listItem.data.image =
        "https://avatars.dicebear.com/api/avataaars/" +
        token.tokenOwner +
        ".svg";
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
    <!-- <TokenItem mapping={accountxDai} /> -->
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
        <LoadingSpinner />
      </div>
    {/if}
  </div>
</div>
