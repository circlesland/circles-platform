<script lang="ts">
  import { CirclesHub } from "src/libs/o-circles-protocol/circles/circlesHub";
  import {
    AddressLookup,
    Person,
    TokenAndOwner,
  } from "src/libs/o-circles-protocol/model/person";
  import { config } from "src/libs/o-circles-protocol/config";
  import FriendItem from "src/libs/o-views/molecules/FriendItem.svelte";
  import CategoryTitle from "src/libs/o-views/atoms/CategoryTitle.svelte";
  import { Jumper } from "svelte-loading-spinners";
  import {
    labelTrusted,
    labelMutual,
    labelTrusting,
    labelRevoked,
  } from "./../../data/friends";
  import {Subscription} from "rxjs";
  import {OmoEvent} from "../../../../libs/o-events/omoEvent";
  import {onDestroy, onMount} from "svelte";

  let mySafeAddress: string;

  let person: Person;
  let personsThatTrustMe: any[] = [];
  let personsITrust: any[] = [];
  let mutualFriends: any[] = [];
  let mutual: { [address: string]: any } = {};
  let untrusted: any[] = [];
  let untrusted_: { [address: string]: any } = {};

  async function init() {
    const hubAddress = config.getCurrent().HUB_ADDRESS;
    const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);
    mySafeAddress = (await window.o.safe()).address;
    person = new Person(circlesHub, mySafeAddress);

    reload();
  }

  async function reload() {
    let t1: AddressLookup = await person.getPersonsThatTrustMe();
    let t2: AddressLookup = await person.getPersonsITrust();

    Object.keys(t1)
      .map((k) => <TokenAndOwner>t1[k])
      .filter((o) => o.limit > 0);

    untrusted = Object.keys(t2)
      .map((k) => <TokenAndOwner>t2[k])
      .filter((o) => o && o.limit == 0)
      .map((mutualTrust) => {
        untrusted_[mutualTrust.owner.address] = true;
        return {
          image:
            "https://avatars.dicebear.com/api/avataaars/" +
            mutualTrust.owner.address +
            ".svg ",
          title: mutualTrust.owner.address.slice(0, 8),
          connection: "trustRevoked",
          detail: {
            limit: "0",
            address: mutualTrust.owner.address,
          },
          actions: ["trust", "send"],
        };
      });

    console.log("untrusted:", untrusted);

    let tt2 = {};
    Object.keys(t2)
      .map((o) => t2[o])
      .filter((o) => o.limit > 0)
      .forEach((o) => {
        tt2[o.owner.address] = o;
      });

    mutualFriends = Object.keys(t1)
      .map((k) => <TokenAndOwner>t1[k])
      .filter((o) => o.limit > 0)
      .filter((o) => {
        const isMutual = tt2[o.owner.address] !== undefined;
        if (isMutual) mutual[o.owner.address] = true;

        return isMutual;
      })
      .map((mutualTrust) => {
        return {
          image:
            "https://avatars.dicebear.com/api/avataaars/" +
            mutualTrust.owner.address +
            ".svg ",
          title: mutualTrust.owner.address.slice(0, 8),
          connection: "trustedMutual",
          detail: {
            address: mutualTrust.owner.address,
            limit: mutualTrust.limit,
          },
          actions: ["untrust", "send"],
        };
      });

    console.log("mutualFriends:", mutualFriends);

    personsThatTrustMe = Object.keys(t1)
      .map((k) => <TokenAndOwner>t1[k])
      .filter((o) => o.limit > 0)
      .filter((o) => !mutual[o.owner.address] && !untrusted_[o.owner.address])
      .map((personsThatTrustMe) => {
        return {
          image:
            "https://avatars.dicebear.com/api/avataaars/" +
            personsThatTrustMe.owner.address +
            ".svg ",
          title: personsThatTrustMe.owner.address.slice(0, 8),
          connection: "trustingMe",
          detail: {
            address: personsThatTrustMe.owner.address,
            limit: personsThatTrustMe.limit,
          },
          actions: ["trust", "send"],
        };
      });

    console.log("personsThatTrustMe:", personsThatTrustMe);

    personsITrust = Object.keys(t2)
      .map((k) => <TokenAndOwner>t2[k])
      .filter((o) => o.limit > 0)
      .filter((o) => !mutual[o.owner.address])
      .map((personsITrust) => {
        return {
          image:
            "https://avatars.dicebear.com/api/avataaars/" +
            personsITrust.owner.address +
            ".svg ",
          title: personsITrust.owner.address.slice(0, 8),
          connection: "trustedByMe",
          detail: {
            address: personsITrust.owner.address,
            limit: personsITrust.limit,
          },
          actions: ["untrust", "send"],
        };
      });

    console.log("personsITrust:", personsITrust);
  }

  let subscription: Subscription = window.o.events.subscribe((event: OmoEvent) =>
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

  onMount(() => {
    init();
  })
</script>

<div class="h-full">
  {#if personsThatTrustMe.length <= 1 && mutualFriends.length == 0 && mutualFriends.length == 0 && mutualFriends.length == 0}
    <div class="flex items-center justify-center h-full">
      <Jumper size="150" color="#071D69" unit="px" />
    </div>
  {:else}
    {#if personsThatTrustMe.length > 0}
      <div class="mb-4">
        <CategoryTitle mapping={labelTrusted} />
      </div>
      <div class="mb-4 space-y-2">
        {#each personsThatTrustMe as personThatTrustMe}
          <FriendItem data={personThatTrustMe} />
        {/each}
      </div>
    {/if}

    {#if mutualFriends.length > 0}
      <div class="mb-4">
        <CategoryTitle mapping={labelMutual} />
      </div>
      <div class="mb-4 space-y-2">
        {#each mutualFriends as mutualTrust}
          <FriendItem data={mutualTrust} />
        {/each}
      </div>
    {/if}

    {#if personsITrust.length > 0}
      <div class="mb-4">
        <CategoryTitle mapping={labelTrusting} />
      </div>
      <div class="mb-4 space-y-2">
        {#each personsITrust as personITrust}
          <FriendItem data={personITrust} />
        {/each}
      </div>
    {/if}

    {#if untrusted.length > 0}
      <div class="mb-4">
        <CategoryTitle mapping={labelRevoked} />
      </div>
      <div class="mb-4 space-y-2">
        {#each untrusted as ut}
          <FriendItem data={ut} />
        {/each}
      </div>
    {/if}
  {/if}
</div>
