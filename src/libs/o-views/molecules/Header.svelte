<script lang="ts">
  import Compose from "../atoms/Compose.svelte";
  import { Header } from "./../interfaces/molecules";

  export let mapping: Header;
</script>

<Compose
  columns="auto 1fr auto"
  rows="1fr"
  tw="text-primary lowercase bg-white border-b border-light-200 md:border md:border-light-200 md:rounded-xl">
  <div class="flex items-center justify-center" />
  <div
    class="flex items-center justify-center py-2 text-lg font-bold text-center">
    {mapping.data.title}
  </div>
  <div class="flex items-center justify-center" />
</Compose>
