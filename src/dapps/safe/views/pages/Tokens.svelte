<script lang="ts">
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import Tokens from "src/dapps/safe/views/molecules/Tokens.svelte";
  let header = {
    data: {
      title: "Tokens",
    },
  };
  let address = localStorage.getItem("omo.safeAddress");
</script>

<Compose rows="1fr" columns="1fr" overflowY tw="m-4 md:m-0">
  <Tokens {address} />
</Compose>
