<script lang="ts">
  export let transaction: Date;
  import dayjs from "dayjs";
</script>

<div>{dayjs(transaction).format('MMMM - DD')}</div>
