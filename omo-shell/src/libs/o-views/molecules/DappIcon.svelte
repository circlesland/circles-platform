<script lang="ts">
  import Icon from "fa-svelte";
  import { DappIcon } from "./../interfaces/molecules";

  export let mapping: DappIcon;
</script>

{#if mapping.design.type == 'disabled'}
  <a
    class="flex items-center justify-center h-full p-6 text-center bg-white border border-gray-200 cursor-not-allowed rounded-xl text-light-300">
    <div class="">
      <Icon icon={mapping.design.icon} class="text-4xl md:text-5xl" />
      <p class="pt-3">{mapping.data.title}</p>
      <span class="px-2 py-1 rounded-full text-xxs text-light-300 bg-light-200">
        {#if mapping.data.tag && mapping.data.tag.then}
          {#await mapping.data.tag}
            Loading ...
          {:then tagValue}
            {tagValue}
          {/await}
        {:else}
          {mapping.data.tag}
        {/if}
      </span>
    </div>
  </a>
{:else}
  <a
    href="{mapping.action.route}"
    class="flex items-center justify-center h-full p-6 text-center bg-white border cursor-pointer rounded-xl border-gray-20w0 text-secondary hover:text-secondary-lighter hover:border-secondary-lighter">
    <div class="">
      <Icon icon={mapping.design.icon} class="text-4xl md:text-5xl" />
      <p class="pt-3">{mapping.data.title}</p>
      <span class="px-2 py-1 text-blue-500 bg-blue-300 rounded-full text-xxs">
        {#if mapping.data.tag && mapping.data.tag.then}
          {#await mapping.data.tag}
            Loading ...
          {:then tagValue}
            {tagValue}
          {/await}
        {:else}
          {mapping.data.tag}
        {/if}
      </span>
    </div>
  </a>
{/if}
