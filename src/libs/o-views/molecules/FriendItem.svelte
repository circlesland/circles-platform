<script lang="ts">
  export let data = {
    image: "",
    title: "",
    detail: {
      address: "",
    },
    connection: "",
    actions: [],
  };
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
  <div class="w-full bg-white border rounded card border-light-200">
    <div class="flex items-center justify-center p-2">
      <img src={data.image} alt="CRC" />
    </div>
    <div class="p-2">
      <div class="text-lg text-primary">{data.title}</div>
      <p class="-mt-1 text-xs text-gray-500">
        <i class="fas fa-exchange-alt" /><span class="ml-2">
          {data.connection}</span>
      </p>
    </div>
    <div class="flex justify-end p-2 space-x-2 text-right">
      {#each data.actions as a}
        {#if a == 'send'}
          <div
            class="flex items-center content-end justify-center w-10 p-3 text-gray-500 bg-gray-300 border-l border-gray-300 rounded hover:bg-primary hover:text-white">
            <i class="fas fa-money-bill-wave" />
          </div>
        {:else if a == 'send' && data.connection == 'mutual'}
          <div
            class="flex items-center content-end justify-center w-10 p-3 text-gray-500 bg-gray-300 border-l border-gray-300 rounded hover:bg-primary hover:text-white">
            <i class="fas fa-money-bill-wave" />
          </div>
        {:else if a == 'trust'}
          <div
            class="flex items-center content-end justify-center w-10 p-3 text-white border-l border-gray-300 rounded bg-secondary hover:bg-primary">
            <i class="fas fa-heart" />
          </div>
        {:else if a == 'untrust'}
          <div
            class="flex items-center content-end justify-center w-10 p-3 text-gray-500 bg-gray-300 border-l border-gray-300 rounded hover:bg-red-400 hover:text-white">
            <i class="fas fa-minus" />
          </div>
        {/if}
      {/each}
    </div>
  </div>
  {#if data.detail}
    <div
      class="w-full p-2 text-xs text-gray-500 bg-white border-b border-l border-r border-light-200">
      {data.detail.address}
    </div>
  {/if}
</div>
<!-- 
<div class="flex items-center content-end justify-center">
  <div
    class="flex items-center content-end justify-center w-12 h-12 p-3 border-l border-gray-300 rounded ">
    <img src="icons/removeTrust.svg" alt="add" />
  </div>
  <div
    class="flex items-center content-end justify-center w-12 h-12 p-3 border-l border-gray-300 rounded bg-primary">
    <i class="fas fa-money-bill-wave" />
  </div>
</div> -->
