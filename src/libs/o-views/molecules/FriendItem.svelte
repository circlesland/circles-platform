<script lang="ts">
  import { actionTypes } from "xstate/lib/actions";

  export let data = {
    image: "",
    title: "",
    description: "",
    attached: {},
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
        <span class="text-xs text-gray-500">{data.description}</span>
      </p>
    </div>
    <div class="flex justify-end p-2 space-x-2 text-right">
      {#each data.actions as a}
        <div
          class="flex items-center content-end justify-center w-10 p-3 text-white border-l border-gray-300 rounded bg-secondary hover:bg-primary">
          {#if a.name == 'send'}<i class="fas fa-money-bill-wave" />{/if}
          {#if a.name == 'trust'}<i class="fas fa-heart" />{/if}
        </div>
      {/each}
    </div>
  </div>
  {#if data.attached}
    <div
      class="w-full p-2 text-xs text-gray-500 bg-white border-b border-l border-r border-light-200">
      {data.attached}
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
