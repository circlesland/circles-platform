<script>
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
</script>

<Compose rows="1fr" columns="1fr" tw="w-full max-w-4xl mx-auto">
  <Compose rows="1fr" columns="1fr" tw="w-full">
    <slot />
  </Compose>
</Compose>
