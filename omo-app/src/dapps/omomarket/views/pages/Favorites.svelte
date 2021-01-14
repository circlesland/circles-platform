<script lang="ts">
  import {tryGetDappState} from "../../../../libs/o-os/loader";
  import {OmoSapienState} from "../../../omosapien/manifest";
  import {runWithDrive} from "../../../../libs/o-fission/initFission";
  import ListItem from "../../../../libs/o-views/molecules/ListItem.svelte";
  import {ListItem as IListItem} from "../../../../libs/o-views/interfaces/molecules";
  import {Offer} from "../../../../libs/o-fission/entities/offer";
  import CategoryTitle from "../../../../libs/o-views/atoms/CategoryTitle.svelte";
  import {faEdit, faGlobe, faHome} from "@fortawesome/free-solid-svg-icons";
  import {RunProcess} from "../../../../libs/o-events/runProcess";
  import {publishOffer, PublishOfferContext} from "../../processes/publishOffer/publishOffer";
  import {unpublishOffer, UnpublishOfferContext} from "../../processes/unpublishOffer/unpublishOffer";

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
    console.log("MyOffer:", offer);

    const actions = [{
      title: "Edit offer",
      icon: faEdit,
      action: () => {
        runWithDrive(async drive => {

        });
        console.log("Edit")
      }
    }];

    if (!offer.isPublished)
    {
      actions.push({
        icon: faGlobe,
        title: "Publish offer",
        action: () =>
        {
          window.o.publishEvent(new RunProcess(publishOffer, async (processContext:PublishOfferContext) => {
            processContext.data.offerName = {
              key: "offerName",
              isValid: true,
              value: offer.name,
              type: "string"
            };
            return processContext;
          }));
        }
      });
    } else {
      actions.push({
        icon: faHome,
        title: "Unpublish offer",
        action: () =>
        {
          window.o.publishEvent(new RunProcess(unpublishOffer, async (processContext:UnpublishOfferContext) => {
            processContext.data.offerName = {
              key: "offerName",
              isValid: true,
              value: offer.name,
              type: "string"
            };
            return processContext;
          }));
        }
      });
    }

    // const locationParts = offer.productLocation.display_name.split(",");
    // const country = locationParts[locationParts.length - 1];
    const offerItem: IListItem = <IListItem>{
      data: {
        title: offer.productName,
        image: offer.productPicture,
        description: offer.productDescription,
        balance: offer.productPrice,
        subtitle: offer.productDescription,
        actions: actions
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
