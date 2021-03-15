<script lang="ts">
  import {tryGetDappState} from "omo-kernel/dist/kernel";
  import {Contact, Message} from "omo-central/dist/generated";
  import {FissionAuthState} from "omo-fission/dist/manifest";
  import {OmoCentral} from "omo-central/dist/omoCentral";
  import Conversation from "../../../cells/message/views/layouts/Conversation.svelte";

  const fissionAuth = tryGetDappState<FissionAuthState>("omo.fission.auth:1");

  let myMessages: Message[] = [];
  let contact:Contact;

  async function init() {
    const api = await OmoCentral.instance.subscribeToResult();
    const contacts = await api.queryContacts(fissionAuth.state.username);
    contact = contacts.contacts[0];

    const contactUsername = window.o.contactUsername; // TODO: Fix the quick hack via 'o' and introduce proper parameters

    const myInbox = await api.queryConversation(contactUsername);
    myMessages = myInbox.conversation;
  }

  init();

  const newMessagesLabel = {
    data: {
      label: "Unread messages.ts",
    },
  };
  const oldMessagesLabel = {
    data: {
      label: "Older messages.ts",
    },
  };
</script>

{#if contact}
  <Conversation messages={myMessages} contact={contact} />
{:else}
  Loading ..
{/if}