<script lang="ts">
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import Balance from "../molecules/Balance.svelte";
  import Transactions from "../molecules/Transactions.svelte";

  let address = localStorage.getItem("omo.safeAddress");

  let header = {
    data: {
      title: "Safe",
    },
  };
</script>

<Compose rows="48px 160px 1fr" columns="1fr">
  <Header mapping={header} />
  <Balance {address} />
  <Compose rows="1fr" columns="1fr" overflowY>
    <Transactions {address} />
  </Compose>
</Compose>
