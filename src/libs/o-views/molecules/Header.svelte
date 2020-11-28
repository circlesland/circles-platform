<script lang="ts">
  import Compose from "../atoms/Compose.svelte";

  interface Header {
    data: {
      title: string;
    };
  }
  export let mapping: Header;
</script>

<Compose
  columns="auto 1fr auto"
  rows="1fr"
  tw="text-primary lowercase bg-white border-b border-light-200">
  <div class="flex items-center justify-center" />
  <div
    class="flex items-center justify-center py-2 text-lg font-bold text-center">
    {mapping.data.title}
  </div>
  <div class="flex items-center justify-center" />
</Compose>
