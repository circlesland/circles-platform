<script lang="ts">
  import ContactList from "../../../../cells/contact/views/layouts/ContactList.svelte";
</script>

<div>
  <div class="mb-4 space-y-2">
    <ContactList client={o.graphQLClient} view="list" />
  </div>
</div>
