<script lang="ts">
  import {tryGetDappState} from "../../../../libs/o-os/loader";
  import {OmoSapienState} from "../../../omosapien/manifest";
  import {runWithDrive} from "../../../../libs/o-fission/initFission";
  import ListItem from "../../../../libs/o-views/molecules/ListItem.svelte";
  import {ListItem as IListItem} from "../../../../libs/o-views/interfaces/molecules";
  import {Offer} from "../../../../libs/o-fission/entities/offer";
  import CategoryTitle from "../../../../libs/o-views/atoms/CategoryTitle.svelte";

  const omosapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");
  let myOffers: Offer[] = [];

  async function init()
  {
    if (omosapienState)
    {
      await runWithDrive(async fissiondrive =>
      {
        myOffers = await fissiondrive.offers.listItems();
      });
    }
  }

  init();

  function mapToListItem(offer: Offer)
  {
    console.log(offer);
    // const locationParts = offer.productLocation.display_name.split(",");
    // const country = locationParts[locationParts.length - 1];
    const offerItem: IListItem = <IListItem>{
      data: {
        title: offer.productName,
        image: offer.productPicture,
        description: offer.productDescription,
        balance: offer.productPrice,
        subtitle: offer.productDescription,
        actions: [{
          title: "Edit offer"
        },{
          title: "Publish offer"
        },{
          title: "Unpublish offer"
        }]
      }
    };

    return offerItem;
  }

  const labelMyOffers = {
    data: {
      label: "My offers",
    },
  };
</script>

<div>
  <div class="mb-4">
    <CategoryTitle mapping={labelMyOffers} />
  </div>
  <div class="mb-4 space-y-2">
    {#each myOffers.map(o => mapToListItem(o)) as item}
      <ListItem mapping={item} />
    {/each}
  </div>
</div>
