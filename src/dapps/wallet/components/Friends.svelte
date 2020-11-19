<script lang="ts">
  import { CirclesHub } from "src/libs/o-circles-protocol/circles/circlesHub";
  import {
    AddressLookup,
    Person,
    TokenAndOwner,
  } from "src/libs/o-circles-protocol/model/person";
  import { config } from "src/libs/o-circles-protocol/config";
  import FriendItem from "src/libs/o-views/molecules/FriendItem.svelte";
  import { Jumper } from "svelte-loading-spinners";

  export let address: string;
  let mySafeAddress: string;

  let person: Person;
  let personsThatTrustMe: any[] = [];
  let personsITrust: any[] = [];
  let mutualFriends: any[] = [];
  let mutual: { [address: string]: any } = {};
  let untrusted: any[] = [];
  let untrusted_: { [address: string]: any } = {};

  function init(addr: string) {
    const hubAddress = config.getCurrent().HUB_ADDRESS;
    const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);
    mySafeAddress = localStorage.getItem("omo.safeAddress");

    person = new Person(circlesHub, addr);

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
          actions: ["trust"],
        };
      });

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
          actions: ["untrust"],
        };
      });

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
          actions: ["trust"],
        };
      });

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
          actions: ["untrust"],
        };
      });
  }

  $: {
    if (config.getCurrent().web3().utils.isAddress(address)) {
      init(address);
    }
  }
</script>

<div class="h-full space-y-2">
  {#if personsThatTrustMe.length <= 1 && mutualFriends.length == 0 && mutualFriends.length == 0 && mutualFriends.length == 0}
    <div class="flex items-center justify-center h-full">
      <Jumper size="150" color="#071D69" unit="px" />
    </div>
  {:else}
    {#if personsThatTrustMe.length > 0}
      <div class="pl-1 text-gray-500 lowercase font-title">
        New trust friend requests
      </div>
    {/if}

    {#each personsThatTrustMe as personThatTrustMe}
      <FriendItem data={personThatTrustMe} />
    {/each}

    {#if mutualFriends.length > 0}
      <div class="pl-1 text-gray-500 lowercase font-title">
        Mutually trusted friends
      </div>
    {/if}

    {#each mutualFriends as mutualTrust}
      <FriendItem data={mutualTrust} />
    {/each}

    {#if personsITrust.length > 0}
      <div class="pl-1 text-gray-500 lowercase font-title">
        Friends, who only you trust
      </div>
    {/if}

    {#each personsITrust as personITrust}
      <FriendItem data={personITrust} />
    {/each}

    {#if untrusted.length > 0}
      <div class="pl-1 text-gray-500 lowercase font-title">
        Friends, where I revoked Friends
      </div>
    {/if}
    {#each untrusted as ut}
      <FriendItem data={ut} />
    {/each}
  {/if}
</div>
