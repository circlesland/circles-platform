<script lang="ts">
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import Tokens from "src/dapps/safe/views/molecules/Tokens.svelte";
  let header = {
    data: {
      title: "Tokens",
    },
  };
</script>

<Compose rows="1fr" columns="1fr" overflowY tw="mx-4 mt-4 lg:mx-0 lg:mt-2">
  <Tokens />
</Compose>
