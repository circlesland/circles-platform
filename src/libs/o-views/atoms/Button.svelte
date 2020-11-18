<script lang="ts">
  export let text: string = "";
  export let type: string = "";
  export let disabled: Boolean = false;
</script>

{#if type == 'primary' && !disabled}
  <div
    class="w-full p-2 font-bold text-center text-white uppercase border-2 rounded-lg cursor-pointer border-secondary bg-secondary hover:border-secondary-lighter hover:bg-secondary-lighter">
    {text}
  </div>
{/if}

{#if type == 'secondary' && !disabled}
  <div
    class="w-full p-2 font-bold text-center uppercase bg-white border-2 rounded-lg cursor-pointer border-secondary text-secondary hover:border-secondary-lighter hover:text-secondary-lighter">
    {text}
  </div>
{/if}

{#if type == 'light' && !disabled}
  <div
    class="w-full p-2 font-bold text-center uppercase bg-white border-2 rounded-lg cursor-pointer border-light-400 text-light-400 hover:border-secondary-lighter hover:text-secondary-lighter">
    {text}
  </div>
{/if}

{#if type == 'light-danger' && !disabled}
  <div
    class="w-full p-2 font-bold text-center uppercase bg-white border-2 rounded-lg cursor-pointer border-light-400 text-light-400 hover:border-red-500 hover:text-red-500">
    {text}
  </div>
{/if}

{#if disabled}
  <div
    class="w-full p-2 font-bold text-center uppercase bg-white border-2 rounded-lg border-light-300 text-light-300">
    {text}
  </div>
{/if}
