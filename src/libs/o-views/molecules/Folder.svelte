<script lang="ts">
  export let data = {
    name: "",
    mtime: 0,
    isFile: false,
    size: 0,
    pointer: "",
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
      <!-- <img src={data.image} alt="CRC" /> -->
      {#if data.isFile}FILE{:else}DIR{/if}
    </div>
    <div class="px-1 py-2">
      <div class="text-base text-primary">{data.name}</div>
      <p class="text-xs text-gray-500">
        <span class="text-xs text-gray-500">{data.mtime}</span>
      </p>
    </div>
    <div class="p-1 px-4 text-right">
      <div class="py-1 text-3xl font-light text-action">{data.size}</div>
    </div>
  </div>
  {#if data.pointer && openDetail}
    <div
      class="w-full p-2 text-xs text-gray-500 bg-white border-b border-l border-r border-light-200">
      Address:
      <span class="text-primary">{data.pointer}</span>
    </div>
  {/if}
</div>
