<script lang="ts">
  import Mobile from "src/libs/o-views/templates/Mobile.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Balance from "../molecules/Balance.svelte";
  import Transactions from "../molecules/Transactions.svelte";
</script>

<Mobile>
  <Compose rows="200px 1fr" columns="1fr" tw="md:pt-2">
    <Balance />
    <Compose rows="1fr" columns="1fr" tw="mx-4 mt-4 md:mx-0 md:mt-2" overflowY>
      <Transactions />
    </Compose>
  </Compose>
</Mobile>
