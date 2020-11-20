<script lang="ts">
  import CirclesDistribution from "./../molecules/CirclesDistribution.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import Tokens from "src/dapps/wallet/views/molecules/Tokens.svelte";
  let header = {
    title: "Tokens",
  };
  let address = localStorage.getItem("omo.safeAddress");
</script>

<!--<script lang="ts">
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import Tokens from "src/dapps/wallet/components/Tokens.svelte";
  import TemplateSafe from "src/libs/o-views/templates/TemplateSafe.svelte";

  let header = {
    title: "Tokens",
  };

  let address = localStorage.getItem("omo.safeAddress");
</script><TemplateSafe>
  <header slot="header">
    <Header data={header} />
  </header>
  <main slot="main">
    <Tokens {address} />
  </main>
</TemplateSafe> -->

<Compose rows="48px auto 1fr" columns="1fr">
  <Compose>
    <Header data={header} />
  </Compose>
  <Compose tw="p-4" rows="1fr" columns="1fr">
    <Tokens {address} />
  </Compose>
  <Compose tw="p-4" rows="1fr" columns="1fr">
    <CirclesDistribution {address} />
  </Compose>
</Compose>
