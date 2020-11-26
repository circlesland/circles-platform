<script lang="ts">
  import Icon from "fa-svelte";
  export let data = {
    title: "",
    tag: "",
  };

  export let design = {
    type: "",
  };

  export let icon: any;
</script>

{#if design.type == 'disabled'}
  <div
    class="flex items-center justify-center h-full p-6 text-center bg-white border-2 border-gray-200 rounded cursor-not-allowed text-light-300">
    <div class="">
      <Icon {icon} class="text-5xl" />
      <p class="pt-3 font-title">{data.title}</p>
      <span class="px-2 py-1 text-xs rounded-full text-light-300 bg-light-200">
        {data.tag}
      </span>
    </div>
  </div>
{:else}
  <div
    class="flex items-center justify-center h-full p-6 text-center bg-white border-2 rounded cursor-pointer border-gray-20w0 text-secondary hover:text-secondary-lighter hover:border-secondary-lighter">
    <div class="">
      <Icon {icon} class="text-5xl" />
      <p class="pt-3 font-title">{data.title}</p>
      <span class="px-2 py-1 text-xs text-white rounded-full bg-secondary">
        {data.tag}
      </span>
    </div>
  </div>
{/if}
