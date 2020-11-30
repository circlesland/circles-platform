<script lang="ts">
  import { TokenItem } from "./../interfaces/molecules";

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
    class="w-full bg-white border rounded-xl card border-light-200">
    <div class="flex items-center justify-center p-2">
      <img src={mapping.data.image} alt="CRC" />
    </div>
    <div class="flex items-center">
      <div class="px-1 py-2">
        <div class="text-xs lg:text-base text-primary">
          {mapping.data.title}
        </div>
        <p class="text-gray-500 text-xxs lg:text-xs">
          <span class="text-gray-500">{mapping.data.subtitle}</span>
        </p>
      </div>
    </div>
    <div class="flex items-center pt-0.5 justify-end px-4 text-right">
      <div class="text-3xl font-light text-action">{mapping.data.balance}</div>
    </div>
  </div>
  {#if mapping.data.description && openDetail}
    <div class="px-3">
      <div
        class="w-full p-2 text-gray-500 bg-white border-b border-l border-r rounded-b-xl text-xxs lg:text-xs border-light-200">
        <span class="text-primary">{mapping.data.description}</span>
      </div>
    </div>
  {/if}
</div>
