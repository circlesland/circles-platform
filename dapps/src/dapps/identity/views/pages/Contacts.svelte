<script lang="ts">
  import CategoryTitle from "../../../../libs/o-views/atoms/CategoryTitle.svelte";
  import ContactList from "../../../../cells/contact/views/layouts/ContactList.svelte";

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
    <ContactList client={o.graphQLClient} view="list" />
  </div>
</div>
