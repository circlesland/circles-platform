<script lang="ts">
  import {Offer, Profile} from "omo-central/dist/generated";
  import {createEventDispatcher} from "svelte";
  import Card from "../../../_generic/views/atoms/Card.svelte";
  import {QuickAction} from "omo-kernel-interfaces/dist/quickAction";
  import {faMailBulk, faShoppingCart} from "@fortawesome/free-solid-svg-icons";

  export let profile: Profile;

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

</script>

<Card
  pictureCid={profile.omoAvatarCid}
  pictureMimeType={profile.omoAvatarMimeType}
  avatarCid={profile.omoAvatarCid}
  avatarMimeType={profile.omoAvatarMimeType}
  {statusBadgeColor}
  {statusBadgeText}
  avatarName="{profile.omoFirstName} {profile.omoLastName}"
  avatarStatus={""}
  title={profile.omoFirstName} {profile.omoLastName}
  description={""}
  actions={[contactAction]}
/>