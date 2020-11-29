<script lang="ts">
  import Friends from "../molecules/Friends.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
</script>

<Compose rows="1fr" columns="1fr" overflowY tw="mx-4 md:m-0">
  <Friends />
</Compose>
