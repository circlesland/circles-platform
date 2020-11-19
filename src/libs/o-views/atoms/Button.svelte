<script lang="ts">
  export let text: string = "";
  export let type: string = "";
  export let disabled: Boolean = false;
</script>

{#if type == 'primary' && !disabled}
  <div
    class="w-full p-3 font-bold text-center text-white lowercase border-2 rounded-lg cursor-pointer border-secondary bg-secondary hover:border-secondary-lighter hover:bg-secondary-lighter">
    {text}
  </div>
{/if}

{#if type == 'secondary' && !disabled}
  <div
    class="w-full p-3 font-bold text-center lowercase bg-white border-2 rounded-lg cursor-pointer border-secondary text-secondary hover:border-secondary-lighter hover:text-white hover:bg-secondary-lighter">
    {text}
  </div>
{/if}

{#if type == 'danger' && !disabled}
  <div
    class="w-full p-3 font-bold text-center lowercase bg-white border-2 rounded-lg cursor-pointer border-danger text-danger hover:bg-danger hover:text-white">
    {text}
  </div>
{/if}

{#if type == 'light' && !disabled}
  <div
    class="w-full p-3 font-bold text-center lowercase bg-white border-2 rounded-lg cursor-pointer border-light-400 text-light-400 hover:border-secondary-lighter hover:text-secondary-lighter">
    {text}
  </div>
{/if}

{#if type == 'light-danger' && !disabled}
  <div
    class="w-full p-3 font-bold text-center lowercase bg-white border-2 rounded-lg cursor-pointer border-light-400 text-light-400 hover:border-danger hover:text-danger">
    {text}
  </div>
{/if}

{#if disabled}
  <div
    class="w-full p-3 font-bold text-center lowercase border-2 rounded-lg bg-light-100 border-light-300 text-light-300">
    {text}
  </div>
{/if}
