<script lang="ts">
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Balance from "../molecules/Balance.svelte";
  import Transactions from "../molecules/Transactions.svelte";

  let address = localStorage.getItem("omo.safeAddress");
</script>

<Compose rows="160px 1fr" columns="1fr">
  <Balance {address} />
  <Compose rows="1fr" columns="1fr" overflowY>
    <Transactions {address} />
  </Compose>
</Compose>
