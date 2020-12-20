<script lang="ts">
  import FriendItem from "src/libs/o-views/molecules/FriendItem.svelte";
  import CategoryTitle from "src/libs/o-views/atoms/CategoryTitle.svelte";
  import {Jumper} from "svelte-loading-spinners";
  import {
    labelTrusted,
    labelMutual,
    labelTrusting,
    labelRevoked,
  } from "../../data/friends";
  import {Subscription} from "rxjs";
  import {onDestroy, onMount} from "svelte";
  import {tryGetDappState} from "../../../../libs/o-os/loader";
  import {Contact, OmoSafeState} from "../../manifest";

  let safeState: OmoSafeState = {};
  let contactsSubscription: Subscription;
  let contacts: Contact[] = [];

  let circlesProfiles:{[safeAddress:string]:{
    loaded: boolean,
    avatarUrl?: string,
    id?: number,
    safeAddress: string,
    username?: string
  }} = {};

  $:{
    if (circlesProfiles) {
      contacts = contacts;
    }
  }

  function init()
  {
    if (contactsSubscription)
    {
      contactsSubscription.unsubscribe();
      contactsSubscription = null;
    }

    safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

    if (safeState.myContacts)
    {
      contactsSubscription = safeState.myContacts.subscribe(async contactList =>
      {
        contacts = contactList;

        const circlesApiUrls = contacts.filter(o => !circlesProfiles[o.safeAddress]).map(o => {
          circlesProfiles[o.safeAddress] = {
            safeAddress: o.safeAddress,
            loaded: false
          };
          return "address[]=" + o.safeAddress;
        }).join("&");

        if (circlesApiUrls !== "")
        {
          let url = "https://api.circles.garden/api/users/?" + circlesApiUrls;
          const response = await fetch(url);
          const responseJson = await response.json();
          responseJson.data.forEach(entry => {
            circlesProfiles[entry.safeAddress] = entry;
          });
          circlesProfiles = circlesProfiles;
          console.log("Circles profiles:", circlesProfiles);
        }
      });
    }

    console.log("MyContacts:", contacts);
  }

  function mapToListItem(contact: Contact)
  {
    const image = circlesProfiles[contact.safeAddress]?.avatarUrl
      ?? "https://avatars.dicebear.com/api/avataaars/" + contact.safeAddress + ".svg";

    const title = circlesProfiles[contact.safeAddress]?.username
      ??  contact.safeAddress.slice(0, 8);

    return {
      image: image,
      title: title,
      detail: {
        address: contact.safeAddress,
        trust: contact.trust,
      },
      actions: ["untrust"],
    };
  }

  onDestroy(() =>
  {
    if (!contactsSubscription) return;

    contactsSubscription.unsubscribe();
    contactsSubscription = null;
  });

  onMount(() =>
  {
    init();
  });
</script>

<div class="h-full">
  {#if contacts.length === 0}
    <div class="flex items-center justify-center h-full">
      <Jumper size="150" color="#071D69" unit="px"/>
    </div>
  {:else}
    {#if contacts.filter(o => o.trust.in > 0 && o.trust.out === 0).length > 0}
      <div class="mb-4">
        <CategoryTitle mapping={labelTrusted}/>
      </div>
      <div class="mb-4 space-y-2">
        {#each contacts.filter(o => o.trust.in > 0 && o.trust.out === 0) as personThatTrustMe}
          <FriendItem data={mapToListItem(personThatTrustMe)}/>
        {/each}
      </div>
    {/if}

    {#if contacts.filter(o => o.trust.in > 0 && o.trust.out > 0).length > 0}
      <div class="mb-4">
        <CategoryTitle mapping={labelMutual}/>
      </div>
      <div class="mb-4 space-y-2">
        {#each contacts.filter(o => o.trust.in > 0 && o.trust.out > 0) as mutualTrust}
          <FriendItem data={mapToListItem(mutualTrust)}/>
        {/each}
      </div>
    {/if}

    {#if contacts.filter(o => o.trust.out > 0 && o.trust.in === 0).length > 0}
      <div class="mb-4">
        <CategoryTitle mapping={labelTrusting}/>
      </div>
      <div class="mb-4 space-y-2">
        {#each contacts.filter(o => o.trust.out > 0 && o.trust.in === 0) as personITrust}
          <FriendItem data={mapToListItem(personITrust)}/>
        {/each}
      </div>
    {/if}

    {#if contacts.filter(o => o.trust.out === 0 && o.trust.in === 0).length > 0}
      <div class="mb-4">
        <CategoryTitle mapping={labelRevoked}/>
      </div>
      <div class="mb-4 space-y-2">
        {#each contacts.filter(o => o.trust.out === 0 && o.trust.in === 0) as ut}
          <FriendItem data={mapToListItem(ut)}/>
        {/each}
      </div>
    {/if}
  {/if}
</div>
