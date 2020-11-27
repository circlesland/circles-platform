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
  tw="text-white lowercase bg-primary ">
  <div class="flex items-center justify-center" />
  <div
    class="flex items-center justify-center pt-1 text-xl font-bold text-center ">
    {mapping.data.title}
  </div>
  <div class="flex items-center justify-center" />
</Compose>
