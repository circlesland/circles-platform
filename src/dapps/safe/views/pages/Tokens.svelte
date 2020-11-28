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

<Compose rows="50px 1fr" columns="1fr">
  <Compose>
    <Header mapping={header} />
  </Compose>
  <Compose tw="px-4" rows="1fr" columns="1fr" overflowY>
    <Tokens {address} />
  </Compose>
</Compose>
