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
    } else if (processArtifact.value) {
      processArtifact.isValid = processArtifact.value.toString().trim() !== "";
    }
    dispatch("validated", processArtifact.isValid);
  }

  $: {
    if (processArtifact) {
      console.log("StringEditor.processArtifact:", processArtifact);
      validate();
    }
  }

  onMount(() => {
    validate();
  });
</script>

{#if processArtifact}
  <div class="w-full">
    <div class="flex items-center justify-between w-full">
      <p class="mb-1 text-xs text-gray-700 uppercase">
        {#if processArtifact.label}
          {processArtifact.label}
        {/if}
      </p>
      {#if processArtifact.isReadonly}
        <p class="mb-1 text-xs text-gray-700 uppercase cursor-pointer" on:click={() => {navigator.clipboard.writeText(!processArtifact.value ? "" : processArtifact.value)}}>
          Copy to clipboard
        </p>
      {/if}
    </div>
    <input
      type="text"
      readonly={processArtifact.isReadonly ? 'readonly' : ''}
      placeholder={processArtifact.placeholder ? processArtifact.placeholder : 'Lorem ipsum dolor ..'}
      class:border-action={processArtifact.isValid}
      class:border-danger={!processArtifact.isValid}
      bind:value={processArtifact.value}
      class="w-full p-3 mb-2 text-xl bg-transparent border-2 border-gray-300 rounded-lg outline-none text-primary" />
  </div>
{/if}
