<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let isValid = true;
  export let line: string;
  export let label: string;

  $: {
    dispatch("value", {
      type: "string",
      data: line,
    });
  }
</script>

<div class="w-full">
  <p class="mb-1 text-xs text-gray-700 uppercase">{label}</p>
  <input
    placeholder="Bla bla bla .."
    type="string"
    class:border={!isValid}
    class:border-red-500={!isValid}
    bind:value={line}
    class="w-full p-2 mb-2 text-xl bg-transparent border border-gray-300 rounded text-primary" />
</div>
