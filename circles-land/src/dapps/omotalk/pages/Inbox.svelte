<script lang="ts">
  import {tryGetDappState} from "omo-kernel/dist/kernel";
  import {Message} from "omo-central/dist/generated";
  import {FissionAuthState} from "omo-fission/dist/manifest";
  import CategoryTitle from "../../../libs/o-views/atoms/CategoryTitle.svelte";
  import ListItem from "../../../libs/o-views/atoms/ListItem.svelte";
  import {OmoCentral} from "omo-central/dist/omoCentral";

  const fissionAuth = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  let myMessages: Message[] = [];

  async function init() {
    const api = await OmoCentral.instance.subscribeToResult();
    const myInbox = await api.queryInbox();
    myMessages = myInbox.inbox;
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

<div>
  <div class="mb-4">
    <CategoryTitle mapping={newMessagesLabel} />
  </div>
  <div class="mb-4 space-y-2">
    {#each myMessages.filter(m => !m.readAt) as item}
      <ListItem avatar="https://ipfs.io/ipfs/{item.sender.omoAvatarCid}"
                name="{item.preview}"
                content="{item.sender.omoFirstName + ' ' + item.sender.omoLastName}"/>
    {/each}
  </div>
  <div class="mb-4">
    <CategoryTitle mapping={oldMessagesLabel} />
  </div>
  <div class="mb-4 space-y-2">
    {#each myMessages.filter(m => !!m.readAt) as item}
      <ListItem avatar="https://ipfs.io/ipfs/{item.sender.omoAvatarCid}"
                name="{item.preview}"
                content="{item.sender.omoFirstName + ' ' + item.sender.omoLastName}"/>
    {/each}
  </div>
</div>
