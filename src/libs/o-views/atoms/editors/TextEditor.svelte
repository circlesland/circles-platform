<script lang="ts">
  import { ProcessArtifact } from "../../../o-processes/interfaces/processArtifact";
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
    <textarea
      readonly={processArtifact.isReadonly ? 'readonly' : ''}
      placeholder={processArtifact.placeholder ? processArtifact.placeholder : 'Lorem ipsum dolor ..'}
      class:border-action={processArtifact.isValid}
      class:border-danger={!processArtifact.isValid}
      class="w-full p-2 mb-2 text-xl bg-transparent border border-gray-300 rounded-xl text-primary"
      bind:value={processArtifact.value} />
  </div>
{/if}
