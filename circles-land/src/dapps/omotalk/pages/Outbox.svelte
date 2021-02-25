<script lang="ts">
  import {faEdit} from "@fortawesome/free-solid-svg-icons";
  import {runWithDrive} from "omo-fission/dist/fissionDrive";
  import {tryGetDappState} from "omo-kernel/dist/kernel";
  import {Message, Offer} from "omo-central-client/dist/generated";
  import {FissionAuthState} from "omo-fission/dist/manifest";
  import CategoryTitle from "../../../libs/o-views/atoms/CategoryTitle.svelte";
  import ListItem from "../../../libs/o-views/atoms/ListItem.svelte";

  const fissionAuth = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  let myMessages: Message[] = [];

  async function init() {
    fissionAuth.fissionState.omoCentralClientSubject.subscribe(async api => {
      const myInbox = await api.queryOutbox();
      if (myInbox.errors) {
        console.error(myInbox.errors);
        throw new Error("The API returned an error")
      }
      myMessages = myInbox.data.outbox;
    });
  }

  init();

  const sentMessagesLabel = {
    data: {
      label: "Sent messages",
    },
  };
</script>

<div>
  <div class="mb-4">
    <CategoryTitle mapping={sentMessagesLabel} />
  </div>
  <div class="mb-4 space-y-2">
    {#each myMessages as item}
      <ListItem avatar="https://ipfs.io/ipfs/{item.recipient.omoAvatarCid}"
                name="{item.preview}"
                content="{item.recipient.omoFirstName + ' ' + item.recipient.omoLastName}"/>
    {/each}
  </div>
</div>
