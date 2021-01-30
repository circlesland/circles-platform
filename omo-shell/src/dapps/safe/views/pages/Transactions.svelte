<script lang="ts">
  import Balance from "../molecules/Balance.svelte";
  import Transactions from "../molecules/Transactions.svelte";
</script>

<div style="height:200px; position:sticky; top:0;">
  <Balance />
</div>
<div style="position:sticky; top: 200px;" class="px-3 mb-3 mt-3 py-1 text-sm font-bold lowercase border border-blue-100 rounded-xl bg-blue-50 text-secondary">
  Your transactions
</div>
<Transactions />
