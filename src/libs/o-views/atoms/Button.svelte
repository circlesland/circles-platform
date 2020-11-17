<script lang="ts">
  export let text: string = "";
  export let type: string = "";
  export let disabled: Boolean = false;
</script>

{#if type == 'primary' && !disabled}
  <div
    class="w-full p-2 font-bold text-center text-white uppercase border-2 rounded-lg cursor-pointer border-primary bg-primary hover:border-secondary hover:bg-secondary">
    {text}
  </div>
{/if}

{#if type == 'secondary' && !disabled}
  <div
    class="w-full p-2 font-bold text-center uppercase bg-white border-2 rounded-lg cursor-pointer border-primary text-primary hover:border-secondary hover:text-secondary">
    {text}
  </div>
{/if}

{#if disabled}
  <div
    class="w-full p-2 font-bold text-center uppercase bg-white border-2 rounded-lg border-light-300 text-light-300">
    {text}
  </div>
{/if}
