<script lang="ts">
  import Friends from "../molecules/Friends.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
</script>

<Compose rows="1fr" columns="1fr" overflowY tw="mx-4 mt-4 lg:mx-0 lg:mt-2">
  <Friends />
</Compose>
