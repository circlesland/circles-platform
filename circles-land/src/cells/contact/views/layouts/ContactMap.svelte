<script lang="ts">
  import {Contact} from "omo-central/dist/generated";
  import CategoryTitle from "../../../../libs/o-views/atoms/CategoryTitle.svelte";
  import ContactListItem from "../../../../dapps/identity/views/atoms/ContactListItem.svelte";

  export let contacts: Contact[] = [];

  const labelMyOffers = {
    data: {
      label: "My contacts",
    },
  };
</script>

<div>
  <div class="mb-4">
    <CategoryTitle mapping={labelMyOffers} />
  </div>
  <div class="mb-4 space-y-2">
    {#each contacts as contact}
      <ContactListItem contact={contact} />
    {/each}
  </div>
</div>
