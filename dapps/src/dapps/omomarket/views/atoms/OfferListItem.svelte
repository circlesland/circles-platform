<script lang="ts">
  import {Offer} from "omo-central/dist/generated";
  import {createEventDispatcher} from "svelte";

  export let offer: Offer;

  const dispatch = createEventDispatcher();
  let openDetail: boolean = false;

  function toggleExpand()
  {
    openDetail = !openDetail;
  }

  function getPicture() {
    return offer.pictures?.length > 0 ? ('https://ipfs.io/ipfs/' + offer.pictures[0].cid) : "";
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
  {#if offer}
    <div
      on:click={toggleExpand}
      class="w-full bg-white border rounded-xl card border-light-200">
      <div class="flex items-center justify-center p-2 rounded-lg">
        <img src={getPicture()} alt="CRC" class="rounded-lg" />
      </div>
      <div class="flex items-center">
        <div class="px-1 py-2">
          <div class="text-xs md:text-base text-primary">
            {offer.title}
          </div>
          <p class="text-gray-500 text-xxs md:text-xs">
            <span class="text-gray-500">
              in: {offer.city}, by:
              {offer.createdBy.omoFirstName}
              {offer.createdBy.omoLastName}
            </span>
          </p>
        </div>
      </div>
      <!--
      <div class="flex items-center pt-0.5 justify-end px-4 text-right">
      </div>
      -->
      <div class="flex justify-end p-2 space-x-2 overflow-hidden text-right">
        <div class="text-3xl font-light text-action">
          <span style="white-space:nowrap; display: inline-block">
            {offer.price} <!--<img src="symbols/o-white.svg" alt="o" class="w-4 h-4 mb-1 ml-1"/>-->
          </span>
        </div>
        <!--{#each mapping.data.actions as a}
          <div
            on:click={async (e) => {
              await a.action();
              e.preventDefault();
              e.stopPropagation();
            }}>
            <ButtonIcon mapping={{
              design: {
                icon: a.icon,
                type: "primary",
                disabled: false
              },
              tooltip: a.title
            }} />
          </div>
        {/each}-->
      </div>
    </div>
    {#if offer.description && openDetail}
      <div class="px-3">
        <div
          class="w-full p-2 text-gray-500 bg-white border-b border-l border-r rounded-b-xl text-xxs md:text-xs border-light-200">
          <span class="text-primary">{offer.description}</span>
        </div>
      </div>
    {/if}
  {:else}
    loading ..
  {/if}
</div>