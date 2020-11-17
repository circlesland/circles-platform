<script lang="ts">
  export let icon: string = "";
  export let type: string = "";
  export let disabled: Boolean = false;
</script>

{#if type == 'primary' && !disabled}
  <div
    class="flex items-center content-end justify-center w-10 h-10 p-2 text-white border-2 rounded-lg cursor-pointer border-primary bg-primary hover:border-secondary hover:bg-secondary">
    <i class="fas fa-{icon}" />
  </div>
{/if}

{#if type == 'secondary' && !disabled}
  <div
    class="flex items-center content-end justify-center w-10 h-10 p-2 bg-white border-2 rounded-lg cursor-pointer border-primary text-primary hover:border-secondary hover:text-secondary">
    <i class="fas fa-{icon}" />
  </div>
{/if}

{#if disabled}
  <div
    class="flex items-center content-end justify-center w-10 h-10 p-2 border-2 rounded-lg bg-light-100 border-light-300 text-light-300 ">
    <i class="fas fa-{icon}" />
  </div>
{/if}
