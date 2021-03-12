<script lang="ts">
  import CategoryTitle from "../../../../libs/o-views/atoms/CategoryTitle.svelte";
  import {query} from "svelte-apollo";
  import {setClient} from "svelte-apollo";
  import ContactListItem from "../atoms/ContactListItem.svelte";
  import ContactCard from "../atoms/ContactCard.svelte";
  import {RunProcess} from "omo-process/dist/events/runProcess";
  import {sendMessage, SendMessageContext} from "../../../../dapps/omotalk/processes/sendMessage";
  import {OmoCentral} from "omo-central/dist/omoCentral";

  export let client: any;
  export let view: "cards" | "list" | undefined;

  import {Contact, ContactsDocument} from "omo-central/dist/generated";

  setClient(client);
  $:contacts = query(ContactsDocument, {
    variables: {
      fissionName: ""
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
        <ContactListItem
          contact={contact}
          on:contact={() => contact(contact)} />
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






