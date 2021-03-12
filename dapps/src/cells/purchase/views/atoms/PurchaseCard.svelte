<script lang="ts">
  import {Offer, Purchase} from "omo-central/dist/generated";
  import {createEventDispatcher} from "svelte";
  import Card from "../../../_generic/views/atoms/Card.svelte";
  import {QuickAction} from "omo-kernel-interfaces/dist/quickAction";
  import {faMailBulk, faShoppingCart} from "@fortawesome/free-solid-svg-icons";

  export let purchase: Purchase;

  export let statusBadgeText: String;
  export let statusBadgeColor: String = "bg-action";

  const dispatch = createEventDispatcher();

  /*
  <button
    on:click={() => dispatch("contact")}
    class="w-full px-4 py-2 font-semibold bg-transparent border-2 text-secondary border-secondary rounded-xl hover:bg-secondary hover:text-white hover:border-transparent">
    <Icon icon={faMailBulk}/>
    Contact me
  </button>
  <button
    on:click={() => dispatch("checkout")}
    class="px-4 py-2 font-semibold text-white border-2 bg-cation bg-action border-action rounded-xl hover:bg-white hover:text-action hover:border-action">
    <Icon icon={faShoppingCart}/>
  </button>
  */
  const contactAction:QuickAction = {
    type: "trigger",
    pos: "overflow",
    mapping: {
      design: {
        icon: faMailBulk
      },
      data: {
        label: "Contact me"
      }
    },
    event: () => {
      dispatch("contact");
      return undefined;
    }
  };
  const checkoutAction:QuickAction = {
    type: "trigger",
    pos: "overflow",
    mapping: {
      design: {
        icon: faShoppingCart
      },
      data: {
        label: "Checkout"
      }
    },
    event: () => {
      dispatch("checkout");
      return undefined;
    }
  };

  function getPictureCid() {
    return purchase.purchasedItem.pictures?.length > 0 ? purchase.purchasedItem.pictures[0].cid : undefined;
  }
  function getPictureMimeType() {
    return purchase.purchasedItem.pictures?.length > 0 ? purchase.purchasedItem.pictures[0].mimeType : undefined;
  }
</script>

<Card
  pictureCid={getPictureCid()}
  pictureMimeType={getPictureMimeType()}
  avatarCid={purchase.purchasedBy.omoAvatarCid}
  avatarMimeType={purchase.purchasedBy.omoAvatarMimeType}
  avatarName="{purchase.purchasedBy.omoFirstName} {purchase.createdBy.omoLastName}"
  avatarStatus={purchase.purchasedItem.city}
  badgeText={purchase.purchasedItem.price}
  statusBadgeText={statusBadgeText}
  statusBadgeColor={statusBadgeColor}
  title={purchase.purchasedItem.title}
  description={purchase.purchasedItem.description}
  actions={[contactAction, checkoutAction]}
/>