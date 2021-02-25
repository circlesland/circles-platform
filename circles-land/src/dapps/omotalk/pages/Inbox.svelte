<script lang="ts">
  import {tryGetDappState} from "omo-kernel/dist/kernel";
  import {Message} from "omo-central-client/dist/generated";
  import {FissionAuthState} from "omo-fission/dist/manifest";
  import CategoryTitle from "../../../libs/o-views/atoms/CategoryTitle.svelte";
  import ListItem from "../../../libs/o-views/atoms/ListItem.svelte";

  const fissionAuth = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  let myMessages: Message[] = [];

  async function init() {
    fissionAuth.fissionState.omoCentralClientSubject.subscribe(async api => {
      const myInbox = await api.queryInbox();
      if (myInbox.errors) {
        console.error(myInbox.errors);
        throw new Error("The API returned an error")
      }
      myMessages = myInbox.data.inbox;
    });
  }

  init();

  const newMessagesLabel = {
    data: {
      label: "Unread messages",
    },
  };
  const oldMessagesLabel = {
    data: {
      label: "Older messages",
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
