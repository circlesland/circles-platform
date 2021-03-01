<script lang="ts">
  import {RunProcess} from "omo-process/dist/events/runProcess";
  import {sendMessage, SendMessageContext} from "../../../omotalk/processes/sendMessage";
  import {tryGetDappState} from "omo-kernel/dist/kernel";
  import {Offer} from "omo-central/dist/generated";
  import {FissionAuthState} from "omo-fission/dist/manifest";
  import {checkout as checkoutProcess, CheckoutContext} from "../../processes/checkout";
  import OfferCard from "../atoms/OfferCard.svelte";
  import {OmoCentral} from "omo-central/dist/omoCentral";

  const allOffers = [];

  const fissionAuth = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  let offers: Offer[] = [];

  async function init() {
    const api = await OmoCentral.instance.subscribeToResult();
    const result = await api.queryRecentOffers();
    offers = <any>result.offers;
  }

  init();

  function contact(item:Offer) {
    const event = new RunProcess<SendMessageContext>(sendMessage, async ctx => {
      const api = await OmoCentral.instance.subscribeToResult();
      ctx.omoCentral = api;
      ctx.namespace = "omo.talk"
      ctx.topic = "chat";
      ctx.data.recipient = {
        key: "recipient",
        isValid: true,
        value: item.createdBy.circlesAddress,
        type: "string"
      };
      return ctx;
    });
    (<any>window).o.publishEvent(event);
  }

  function checkout(item:Offer) {
    const event = new RunProcess<CheckoutContext>(checkoutProcess, async (ctx: CheckoutContext) => {
      ctx.offer = item;
      return ctx;
    });
    (<any>window).o.publishEvent(event);
  }

</script>

<section class="w-full p-4 mx-auto md:p-8">
  <div class="grid grid-cols-1 gap-8 pb-12 lg:grid-cols-2">
  </div>
  <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    {#each offers as item(item.name)}
      <!--<OfferListItem offer={item} />-->
      <OfferCard offer={item}
                 statusBadgeText="sold"
                 statusBadgeColor="bg-action"
                 on:contact={() => contact(item)}
                 on:checkout={() => checkout(item)}
      />
    {/each}
  </div>
</section>
