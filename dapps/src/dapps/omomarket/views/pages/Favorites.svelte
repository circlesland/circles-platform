<script lang="ts">
  import ListItem from "../../../../libs/o-views/molecules/ListItem.svelte";
  import {ListItem as IListItem} from "../../../../libs/o-views/interfaces/molecules";
  import CategoryTitle from "../../../../libs/o-views/atoms/CategoryTitle.svelte";
  import {faEdit, faHome} from "@fortawesome/free-solid-svg-icons";
  import {unlistOffer, UnlistOfferContext} from "../../processes/unlistOffer";
  import {runWithDrive} from "omo-fission/dist/fissionDrive";
  import {RunProcess} from "omo-process/dist/events/runProcess";
  import {tryGetDappState} from "omo-kernel/dist/kernel";
  import {Offer} from "omo-central/dist/generated";
  import {FissionAuthState} from "omo-fission/dist/manifest";
  import {OmoCentral} from "omo-central/dist/omoCentral";
  import OfferList from "../../../../cells/offer/views/layouts/OfferList.svelte";
/*
  const fissionAuth = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  let myOffers: Offer[] = [];

  async function init() {
    const api = await OmoCentral.instance.subscribeToResult();
    const result = await api.queryOffersOfUser(fissionAuth.state.username);
    myOffers = result.offers;
  }

  init();

  function mapToListItem(offer: Offer) {
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

    actions.push({
      icon: faHome,
      title: "Unlist offer",
      action: () => {
        window.o.publishEvent(new RunProcess(unlistOffer, async (processContext: UnlistOfferContext) => {
          processContext.data.offerName = {
            key: "offerName",
            isValid: true,
            value: offer.title,
            type: "string"
          };
          return processContext;
        }));
      }
    });


    // const locationParts = offer.productLocation.display_name.split(",");
    // const country = locationParts[locationParts.length - 1];
    const offerItem: IListItem = <IListItem>{
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
*/
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
  <OfferList client={o.graphQLClient} view="list" />
  <!--
  <div class="mb-4 space-y-2">
    {#each myOffers.map(o => mapToListItem(o)) as item}
      <ListItem mapping={item} />
    {/each}
  </div>
  -->
</div>
