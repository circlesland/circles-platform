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
      const myProfile = await api.queryProfile(fissionAuth.username);
      if (myProfile.errors) {
        console.error(myProfile.errors);
        throw new Error("The API returned an error")
      }
      myMessages = myProfile.data.profile.receivedMessages;
    });
  }

  init();

  function mapToListItem(offer: Offer) {
    const actions = [{
      title: "Edit offer",
      icon: faEdit,
      action: () => {
        runWithDrive(async drive => {

        });
        console.log("Edit")
      }
    }];

    // const locationParts = offer.productLocation.display_name.split(",");
    // const country = locationParts[locationParts.length - 1];
    const offerItem = {
      data: {
        title: offer.title,
        image: offer.pictures?.length > 0 ? "https://ipfs.io/ipfs/" + offer.pictures[0].cid : undefined,
        description: offer.description,
        balance: offer.price,
        subtitle: offer.city,
        actions: actions
      }
    };

    return offerItem;
  }

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
    {#each myMessages.filter(m => !m.readAt).map(o => mapToListItem(o)) as item}
      <ListItem mapping={item} />
    {/each}
  </div>
  <div class="mb-4">
    <CategoryTitle mapping={oldMessagesLabel} />
  </div>
  <div class="mb-4 space-y-2">
    {#each myMessages.filter(m => !!m.readAt).map(o => mapToListItem(o)) as item}
      <ListItem mapping={item} />
    {/each}
  </div>
</div>
