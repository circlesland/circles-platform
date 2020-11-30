<script lang="ts">
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Balance from "../molecules/Balance.svelte";
  import Transactions from "../molecules/Transactions.svelte";
</script>

<Compose rows="200px 1fr" columns="1fr">
  <Balance />
  <Compose rows="1fr" columns="1fr" tw="mx-4 mt-4 lg:mx-0 lg:mt-2" overflowY>
    <Transactions />
  </Compose>
</Compose>
