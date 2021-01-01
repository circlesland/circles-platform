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
  import {OmoSafeState} from "../../manifest";
  import {Contact} from "../../../../libs/o-circles-protocol/model/contact";

  let safeState: OmoSafeState = {};
  let contactsSubscription: Subscription;
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
        contacts = contactList.filter(o => o.safeAddress !== safeState.mySafeAddress);
      });
    }
  }

  function mapToListItem(contact: Contact)
  {
    const image = contact.circlesProfile?.avatarUrl
      ?? "https://avatars.dicebear.com/api/avataaars/" + contact.safeAddress + ".svg";

    const title = contact.circlesProfile?.username
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
