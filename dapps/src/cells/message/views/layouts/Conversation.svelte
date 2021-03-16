<script lang="ts">
  import ContactListItem from "../../../contact/views/atoms/ContactListItem.svelte";
  import MessageComposer from "../molecules/MessageComposer.svelte";
  import {Contact, Message} from "omo-central/dist/generated";
  import MessageItem from "../atoms/MessageItem.svelte";
  import {OmoCentral} from "omo-central/dist/omoCentral";

  export let contact: Contact;
  export let messages: Message[] = [];


  async function sub() {
    const api = await OmoCentral.instance.subscribeToResult();
    api.events.subscribe(next => {
      console.log("Received message event:", next);
    })
  }
  sub();
</script>

<style>
  .scrollbar-w-2::-webkit-scrollbar {
    width: 0.25rem;
    height: 0.25rem;
  }

  .scrollbar-track-blue-lighter::-webkit-scrollbar-track {
    --bg-opacity: 1;
    background-color: #f7fafc;
    background-color: rgba(247, 250, 252, var(--bg-opacity));
  }

  .scrollbar-thumb-blue::-webkit-scrollbar-thumb {
    --bg-opacity: 1;
    background-color: #edf2f7;
    background-color: rgba(237, 242, 247, var(--bg-opacity));
  }

  .scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
    border-radius: 0.25rem;
  }
</style>

<div class="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
  <div class="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
    <ContactListItem contact={contact} />
  </div>
  <div id="messages" class="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
    {#each messages as message}
      <MessageItem message={message} side={message.recipient.fissionName === contact.contactProfile.fissionName ? "right" : "left"} />
    {/each}
  </div>
  <MessageComposer contact={contact} />
</div>