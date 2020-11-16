<script lang="ts">
  import { CirclesHub } from "src/libs/o-circles-protocol/circles/circlesHub";
  import {
    Person,
    TokenAndOwner,
  } from "src/libs/o-circles-protocol/model/person";
  import { config } from "src/libs/o-circles-protocol/config";
  import { Jumper } from "svelte-loading-spinners";

  import Avatars from "@dicebear/avatars";
  import sprites from "@dicebear/avatars-avataaars-sprites";
  import FriendItem from "src/libs/o-views/molecules/FriendItem.svelte";
  import { Address } from "../../../libs/o-circles-protocol/interfaces/address";

  export let address: string;
  let mySafeAddress: string;

  let person: Person;
  let personsThatTrustMe: TokenAndOwner[] = [];
  let personsITrust: TokenAndOwner[] = [];
  let mutualTrusts: TokenAndOwner[] = [];
  let mutual: { [address: string]: any } = {};

  function init(addr: string) {
    const hubAddress = config.getCurrent().HUB_ADDRESS;
    const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);
    mySafeAddress = localStorage.getItem("omo.safeAddress");

    person = new Person(circlesHub, addr);

    reload();
  }

  async function reload() {
    let t1 = await person.getPersonsThatTrustMe();
    let t2 = await person.getPersonsITrust();

    mutualTrusts = Object.keys(t1)
      .map((k) => t1[k])
      .filter((o) => {
        const isMutual = t2[o.owner.address] !== undefined;
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
          connection: "mutual trust",
          detail: {
            address: mutualTrust.owner.address,
          },
          actions: ["untrust", "send"],
        };
      });

    console.log(mutual);

    personsThatTrustMe = Object.keys(t1)
      .map((k) => t1[k])
      .filter((o) => !mutual[o.owner.address])
      .map((personsThatTrustMe) => {
        return {
          image:
            "https://avatars.dicebear.com/api/avataaars/" +
            personsThatTrustMe.owner.address +
            ".svg ",
          title: personsThatTrustMe.owner.address.slice(0, 8),
          connection: "is trusting you",
          detail: {
            address: personsThatTrustMe.owner.address,
          },
          actions: ["send", "trust"],
        };
      });

    personsITrust = Object.keys(t2)
      .map((k) => t2[k])
      .filter((o) => !mutual[o.owner.address])
      .map((personsITrust) => {
        return {
          image:
            "https://avatars.dicebear.com/api/avataaars/" +
            personsITrust.owner.address +
            ".svg ",
          title: personsITrust.owner.address.slice(0, 8),
          connection: "trusted by you",
          detail: {
            address: personsITrust.owner.address,
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

  let trusting = {
    image: "https://avatars.dicebear.com/api/avataaars/trusting.svg",
    title: "0x1234",
    connection: "trusted by you",
    detail: {
      address: "0x123788dbgx12o81eb8oznogGASfgonolialsf",
    },
    actions: ["untrust"],
  };

  let removed = {
    image: "https://avatars.dicebear.com/api/avataaars/removed.svg",
    title: "0x1234",
    connection: "trust removed",
    detail: {
      address: "0x123788dbgx12o81eb8oznogGASfgonolialsf",
    },
    actions: ["trust"],
  };

  function transferCircles(recipientAddress: Address) {}

  function untrust(recipientAddress: Address) {}
</script>

<div class="py-2 font-bold text-secondary">Mutual Friends</div>

<div class="space-y-2">
  <!-- 
      on:click={() => transferCircles(mutualTrust.owner.address)} 
      on:click={() => untrust(mutualTrust.owner.address)} 
    -->

  {#each mutualTrusts as mutualTrust}
    <FriendItem data={mutualTrust} />
  {/each}

  <div class="py-2 font-bold text-secondary">Friends, who only trust me</div>

  {#each personsThatTrustMe as personThatTrustMe}
    <FriendItem data={personThatTrustMe} />
  {/each}
  <!-- 
{#if address === mySafeAddress}
  <b class="m-4 text-primary">People I trust:</b>
{:else}<b class="m-4 text-primary">People that {address} trusts:</b>{/if} -->

  <div class="py-2 font-bold text-secondary">Friends, who only I trust</div>

  {#each personsITrust as personITrust}
    <FriendItem data={personITrust} />
  {/each}

  <div class="py-2 font-bold text-secondary">Friends, who I removed</div>
  (placeholder)
  <FriendItem data={removed} />
</div>
