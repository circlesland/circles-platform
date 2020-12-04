<script lang="ts">
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import Tokens from "src/dapps/safe/views/molecules/Tokens.svelte";
  import Mobile from "src/libs/o-views/templates/Mobile.svelte";
  let header = {
    data: {
      title: "Tokens",
    },
  };
</script>

<Mobile>
  <Compose rows="1fr" columns="1fr" overflowY tw="mx-4 mt-4 md:mx-0 md:mt-2">
    <Tokens />
  </Compose>
</Mobile>
