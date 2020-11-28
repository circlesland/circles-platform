<script lang="ts">
  interface TokenItem {
    data: {
      image: string;
      title: string;
      subtitle: string;
      balance: number;
      description: string;
    };
  }

  export let mapping: TokenItem;

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
    class="w-full bg-white border rounded-lg card border-light-200">
    <div class="flex items-center justify-center p-2">
      <img src={mapping.data.image} alt="CRC" />
    </div>
    <div class="px-1 py-2">
      <div class="text-base text-primary">{mapping.data.title}</div>
      <p class="text-xs text-gray-500">
        <span class="text-xs text-gray-500">{mapping.data.subtitle}</span>
      </p>
    </div>
    <div class="flex items-center pt-0.5 justify-end px-4 text-right">
      <div class="text-3xl font-light text-action">
        {#if mapping.data.balance < 1}
          {mapping.data.balance.toFixed(4)}
        {:else}{mapping.data.balance.toFixed(2)}{/if}
      </div>
    </div>
  </div>
  {#if mapping.data.description && openDetail}
    <div
      class="w-full p-2 text-xs text-gray-500 bg-white border-b border-l border-r border-light-200">
      Address:
      <span class="text-primary">{mapping.data.description}</span>
    </div>
  {/if}
</div>
