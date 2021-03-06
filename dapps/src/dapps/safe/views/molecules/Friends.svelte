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
  import {onDestroy, onMount} from "svelte";
  import {OmoSafeState} from "../../manifest";
  import {Contact} from "omo-models/dist/omo/contact";
  import {OmoSubscription} from "omo-quirks/dist/OmoSubscription";
  import {tryGetDappState} from "omo-kernel/dist/kernel";

  let safeState: OmoSafeState = {};
  let contactsSubscription: OmoSubscription;
  let contacts: Contact[] = [];

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
        contacts = contactList.payload.filter(o => o.safeAddress !== safeState.mySafeAddress);
      });
    }
  }

  function mapToListItem(contact: Contact)
  {
    const listItem:{
      image: string,
      title: string,
      detail: {
        fissionUsername: string,
        address: string,
        trust: {
          in: number
          out: number
        },
      },
      actions: string[]
    } = {};

    let fissionUsername:string = null;

    if (contact.omoProfile)
    {
      if (contact.omoProfile.avatarCid)
      {
        listItem.image = contact.omoProfile.avatarCid;
      }
      listItem.title = `${contact.omoProfile.profile.firstName} ${contact.omoProfile.profile.lastName}`
      fissionUsername = contact.omoProfile.profile.fissionName;
    }
    else if (contact.circlesProfile)
    {
      listItem.image = contact.circlesProfile?.avatarUrl;
      listItem.title = contact.circlesProfile.username;
    }
    else
    {
      listItem.title = contact.safeAddress.slice(0, 8);
    }

    if (!listItem.image)
    {
      listItem.image = "https://avatars.dicebear.com/api/avataaars/" + contact.safeAddress + ".svg"
    }

    listItem.detail = {
      address: contact.safeAddress,
      fissionUsername: fissionUsername,
      trust: {
        in: contact.trust.in,
        out: contact.trust.out
      }
    };

    listItem.actions = ["untrust"];
    return listItem;
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
  {#if !contacts}
    <div class="flex items-center justify-center h-full">
      <Jumper size="150" color="#071D69" unit="px"/>
    </div>
  {:else if contacts.length == 0}
    <div class="mb-4 space-y-2">
      You don't have any contacts yet. <br/><u><a href="">Invite someone</a></u>
    </div>
  {:else}
    {#if contacts.filter(o => o.trust.in > 0 && !o.trust.out).length > 0}
      <div class="mb-4">
        <CategoryTitle mapping={labelTrusted}/>
      </div>
      <div class="mb-4 space-y-2">
        {#each contacts.filter(o => o.trust.in > 0 && !o.trust.out) as personThatTrustMe}
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

    {#if contacts.filter(o => o.trust.out > 0 && o.trust.in === null).length > 0}
      <div class="mb-4">
        <CategoryTitle mapping={labelTrusting}/>
      </div>
      <div class="mb-4 space-y-2">
        {#each contacts.filter(o => o.trust.out > 0 && o.trust.in === null) as personITrust}
          <FriendItem data={mapToListItem(personITrust)}/>
        {/each}
      </div>
    {/if}

    {#if contacts.filter(o => o.trust.out == 0).length > 0}
      <div class="mb-4">
        <CategoryTitle mapping={labelRevoked}/>
      </div>
      <div class="mb-4 space-y-2">
        {#each contacts.filter(o => o.trust.out == 0) as ut}
          <FriendItem data={mapToListItem(ut)}/>
        {/each}
      </div>
    {/if}
  {/if}
</div>
