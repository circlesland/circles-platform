<script lang="ts">
  import Icon from "fa-svelte";
  export let icon: string = "";
  export let type: string = "";
  export let disabled: Boolean = false;
</script>

{#if type == 'primary' && !disabled}
  <div
    class="flex items-center content-end justify-center w-10 h-10 p-2 text-white border-2 rounded-lg cursor-pointer border-secondary bg-secondary hover:border-secondary-lighter hover:bg-secondary-lighter">
    <Icon {icon} />
  </div>
{/if}

{#if type == 'secondary' && !disabled}
  <div
    class="flex items-center content-end justify-center w-10 h-10 p-2 bg-white border-2 rounded-lg cursor-pointer border-secondary text-secondary hover:border-secondary-lighter hover:text-secondary-lighter">
    <Icon {icon} />
  </div>
{/if}

{#if type == 'light' && !disabled}
  <div
    class="flex items-center content-end justify-center w-10 h-10 p-2 bg-white border-2 rounded-lg cursor-pointer border-light-400 text-light-400 hover:border-secondary-lighter hover:text-secondary-lighter">
    <Icon {icon} />
  </div>
{/if}

{#if type == 'light-danger' && !disabled}
  <div
    class="flex items-center content-end justify-center w-10 h-10 p-2 bg-white border-2 rounded-lg cursor-pointer border-light-300 text-light-300 hover:bg-danger hover:border-danger hover:text-white">
    <Icon {icon} />
  </div>
{/if}

{#if disabled}
  <div
    class="flex items-center content-end justify-center w-10 h-10 p-2 border-2 rounded-lg bg-light-100 border-light-300 text-light-300 ">
    <Icon {icon} />
  </div>
{/if}
