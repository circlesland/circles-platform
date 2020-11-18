<script lang="ts">
  export let data = {
    image: "",
    title: "",
    description: "",
    balance: "",
    currency: "",
  };

  let openDetail: boolean = false;

  function toggleExpand() {
    openDetail = !openDetail;
  }
</script>

<style>
  .card {
    display: grid;
    grid-template-columns: 3.5rem 1fr 1fr;
    grid-template-rows: 3.5rem;
    max-width: 100%;
  }
</style>

<div>
  <div
    on:click={toggleExpand}
    class="w-full bg-white border rounded card border-light-200">
    <div class="flex items-center justify-center p-2">
      <img src={data.image} alt="CRC" />
    </div>
    <div class="px-1 py-2">
      <div class="text-lg text-primary">{data.title}</div>
      <p class="-mt-1 text-xs text-gray-500">
        <span class="text-xs text-gray-500">{data.currency}</span>
      </p>
    </div>
    <div class="p-1 px-4 text-right">
      <div class="text-3xl text-action">
        {parseFloat(data.balance).toFixed(2)}
      </div>
    </div>
  </div>
  {#if data.description && openDetail}
    <div
      class="w-full p-2 text-xs text-gray-500 bg-white border-b border-l border-r border-light-200">
      {data.description}
    </div>
  {/if}
</div>
