<script lang="ts">
  import CategoryTitle from "../../../../libs/o-views/atoms/CategoryTitle.svelte";
  import {query} from "svelte-apollo";
  import {setClient} from "svelte-apollo";
  import ContactListItem from "../atoms/ContactListItem.svelte";
  import ContactCard from "../atoms/ContactCard.svelte";
  import {RunProcess} from "omo-process/dist/events/runProcess";
  import {sendMessage, SendMessageContext} from "../../../../dapps/omotalk/processes/sendMessage";
  import {OmoCentral} from "omo-central/dist/omoCentral";
  import { push } from "svelte-spa-router";

  import {
    faChat
  } from "@fortawesome/free-solid-svg-icons";
  import {Contact, ContactsDocument} from "omo-central/dist/generated";
  import {tryGetDappState} from "omo-kernel/dist/kernel";
  import {FissionAuthState} from "omo-fission/dist/manifest";
  import {QuickAction} from "omo-kernel-interfaces/dist/quickAction";

  export let client: any;
  export let view: "cards" | "list" | undefined;

  // TODO: Use process 'ensureIsAuthenticated' instead of 'tryGetDappState'
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  setClient(client);

  $:contacts = query(ContactsDocument, {
    variables: {
      query: {
        fissionName: fissionAuthState.state.username
      }
    }
  });

  function contact(item:Contact) {
    const event = new RunProcess<SendMessageContext>(sendMessage, async ctx => {
      const api = await OmoCentral.instance.subscribeToResult();
      ctx.omoCentral = api;
      ctx.namespace = "omo.talk"
      ctx.topic = "chat";
      ctx.data.recipient = {
        key: "recipient",
        isValid: true,
        value: item.contactProfile.circlesAddress,
        type: "string"
      };
      return ctx;
    });
    (<any>window).o.publishEvent(event);
  }

  const labelMyContacts = {
    data: {
      label: "My contacts",
    },
  };

</script>

<div>
  <div class="mb-4">
    <CategoryTitle mapping={labelMyContacts} />
  </div>
  {#if !view || view === "list"}
    {#if $contacts.loading}
      Loading contacts...
    {:else if $contacts.error}
      <b>An error occurred while loading the contacts:</b> <br/>{$contacts.error.message}
    {:else if $contacts.data && $contacts.data.contacts && $contacts.data.contacts.length > 0}
      {#each $contacts.data.contacts as contact}
        <div on:click={() => {
          window.o.contactUsername = contact.contactProfile.fissionName;
          push("#/omotalk/chat");
        }}>
        <ContactListItem
          contact={contact}
          on:contact={() => contact(contact)} />
        </div>
      {/each}
    {:else}
      <span>No contacts</span>
    {/if}
  {:else}
    <section class="w-full p-4 mx-auto md:p-8">
      {#if $contacts.loading}
        Loading contacts...
      {:else if $contacts.error}
        <b>An error occurred while loading the contacts:</b> <br/>{$contacts.error.message}
      {:else if $contacts.data && $contacts.data.contacts && $contacts.data.contacts.length > 0}
        {#each $contacts.data.contacts as contact}
          <ContactCard
            contact={contact}
            on:contact={() => contact(contact)} />
        {/each}
      {:else}
        <span>No contacts</span>
      {/if}
    </section>
  {/if}
</div>






