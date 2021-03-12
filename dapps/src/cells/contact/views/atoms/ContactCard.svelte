<script lang="ts">
  import {Contact, Offer} from "omo-central/dist/generated";
  import {createEventDispatcher} from "svelte";
  import Card from "../../../_generic/views/atoms/Card.svelte";
  import {QuickAction} from "omo-kernel-interfaces/dist/quickAction";
  import {faMailBulk, faShoppingCart} from "@fortawesome/free-solid-svg-icons";
  import {RunProcess} from "omo-process/dist/events/runProcess";
  import {sendMessage, SendMessageContext} from "../../../../dapps/omotalk/processes/sendMessage";
  import {OmoCentral} from "omo-central/dist/omoCentral";
  import {checkout as checkoutProcess, CheckoutContext} from "../../../../dapps/omomarket/processes/checkout";

  export let contact: Contact;

  export let statusBadgeText: String;
  export let statusBadgeColor: String = "bg-action";

  const dispatch = createEventDispatcher();

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

</script>

<Card
  pictureCid={contact.contactProfile.omoAvatarCid}
  pictureMimeType={contact.contactProfile.omoAvatarMimeType}
  avatarCid={undefined}
  avatarMimeType={undefined}
  avatarName={undefined}
  avatarStatus={"City here?"}
  badgeText={undefined}
  statusBadgeText={statusBadgeText}
  statusBadgeColor={statusBadgeColor}
  title="{contact.contactProfile.omoFirstName} {contact.contactProfile.omoLastName}"
  description={undefined}
  actions={[contactAction]}
/>