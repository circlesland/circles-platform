<script lang="ts">
  import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
  import { createEventDispatcher, onMount } from "svelte";

  export let processArtifact: ProcessArtifact;
  const dispatch = createEventDispatcher();

  function validate() {
    if (
      (!processArtifact.value ||
        processArtifact.value.toString().trim() === "") &&
      processArtifact.isOptional
    ) {
      processArtifact.isValid = true;
    } else if (
      processArtifact.value !== null &&
      processArtifact.value !== undefined
    ) {
      try {
        processArtifact.isValid = processArtifact.value > 0;
      } catch (e) {
        processArtifact.isValid = false;
      }
    }
    dispatch("validated", processArtifact.isValid);
  }

  $: {
    if (processArtifact) {
      validate();
    }
  }

  onMount(() => {
    validate();
  });
</script>

{#if processArtifact}
  <div class="w-full">
    {#if processArtifact.label}
      <p class="mb-1 text-xs text-gray-700 uppercase">
        {processArtifact.label}
      </p>
    {/if}
    <input
      type="number"
      min="0"
      readonly={processArtifact.isReadonly ? 'readonly' : ''}
      placeholder={processArtifact.placeholder ? processArtifact.placeholder : '0.00'}
      class:border-action={processArtifact.isValid}
      class:border-danger={!processArtifact.isValid}
      class="w-full p-3 mb-2 text-xl bg-transparent border-2 border-gray-300 rounded-lg outline-none text-primary"
      bind:value={processArtifact.value} />
  </div>
{/if}
