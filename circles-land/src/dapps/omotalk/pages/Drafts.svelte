<script lang="ts">
  import {faEdit} from "@fortawesome/free-solid-svg-icons";
  import {runWithDrive} from "omo-fission/dist/fissionDrive";
  import {tryGetDappState} from "omo-kernel/dist/kernel";
  import {Message, Offer} from "omo-central/dist/generated";
  import {FissionAuthState} from "omo-fission/dist/manifest";
  import CategoryTitle from "../../../libs/o-views/atoms/CategoryTitle.svelte";
  import ListItem from "../../../libs/o-views/atoms/ListItem.svelte";

  const fissionAuth = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  let myMessages: Message[] = [];

  async function init() {
  }

  init();

  const draftMessagesLabel = {
    data: {
      label: "Drafts",
    },
  };
</script>

<div>
  <div class="mb-4">
    <CategoryTitle mapping={draftMessagesLabel} />
  </div>
  <div class="mb-4 space-y-2">
    {#each myMessages as item}
      <ListItem avatar="https://ipfs.io/ipfs/{item.sender.omoAvatarCid}"
                name="{item.preview}"
                content="{item.sender.omoFirstName + ' ' + item.sender.omoLastName}"/>
    {/each}
  </div>
</div>
