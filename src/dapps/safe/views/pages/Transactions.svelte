<script lang="ts">
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Balance from "../molecules/Balance.svelte";
  import Transactions from "../molecules/Transactions.svelte";

  let address = localStorage.getItem("omo.safeAddress");
</script>

<Compose rows="200px 1fr" columns="1fr">
  <Balance {address} />
  <Compose rows="1fr" columns="1fr" tw="mx-4 mt-4 md:mx-0 md:mt-2" overflowY>
    <Transactions {address} />
  </Compose>
</Compose>
