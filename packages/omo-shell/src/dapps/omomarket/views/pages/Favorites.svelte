<script lang="ts">
  import {tryGetDappState} from "../../../../libs/o-os/loader";
  import {OmoSapienState} from "../../../omosapien/manifest";
  import ListItem from "../../../../libs/o-views/molecules/ListItem.svelte";
  import {ListItem as IListItem} from "../../../../libs/o-views/interfaces/molecules";
  import CategoryTitle from "../../../../libs/o-views/atoms/CategoryTitle.svelte";
  import {faEdit, faGlobe, faHome} from "@fortawesome/free-solid-svg-icons";
  import {publishOffer, PublishOfferContext} from "../../processes/publishOffer/publishOffer";
  import {unpublishOffer, UnpublishOfferContext} from "../../processes/unpublishOffer/unpublishOffer";
  import {OfferMetadata} from "omo-fission/dist/directories/offers";
  import {runWithDrive} from "omo-fission/dist/fissionDrive";
  import {RunProcess} from "omo-process/dist/events/runProcess";

  const omosapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");
  let myOffers: OfferMetadata[] = [];

  async function init()
  {
    if (omosapienState)
    {
      await runWithDrive(async fissiondrive =>
      {
        const itemNames = await fissiondrive.offers.listNames();
        const offers:OfferMetadata[] = await Promise.all(itemNames.map(async itemName => {
          const offerMetadataBuffer = await fissiondrive.offers.tryGetFileByPath([itemName, "metadata"]);
          const offerMetadataJson = offerMetadataBuffer.toString();
          const offerMetadata:OfferMetadata = JSON.parse(offerMetadataJson);
          return offerMetadata;
        }));

        myOffers = offers;
      });
    }
  }

  init();

  function mapToListItem(offer: OfferMetadata)
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

    if (!offer.description.isPublished)
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
              value: offer.description.productName,
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
              value: offer.description.productName,
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
        title: offer.description.productName,
        image: "", // offer.productPicture,
        description: offer.description.productDescription,
        balance: offer.description.productPrice,
        subtitle: offer.description.productLocation.display_name,
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
