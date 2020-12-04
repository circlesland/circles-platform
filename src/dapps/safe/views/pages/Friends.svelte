<script lang="ts">
  import Friends from "../molecules/Friends.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Mobile from "src/libs/o-views/templates/Mobile.svelte";
</script>

<Mobile>
  <Compose rows="1fr" columns="1fr" overflowY tw="mx-4 mt-4 md:mx-0 md:mt-2">
    <Friends />
  </Compose>
</Mobile>
