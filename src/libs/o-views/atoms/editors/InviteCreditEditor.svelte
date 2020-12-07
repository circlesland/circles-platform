<script lang="ts">
  import { ProcessArtifact } from "../../../o-processes/interfaces/processArtifact";
  import { createEventDispatcher, onMount } from "svelte";

  export let processArtifact: ProcessArtifact;
  const dispatch = createEventDispatcher();

  function validate() {
    processArtifact.isValid = true;
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
      readonly={processArtifact.isReadonly ? 'readonly' : ''}
      placeholder={processArtifact.placeholder ? processArtifact.placeholder : '0'}
      max={processArtifact.max ? processArtifact.max : 99999999}
      type="number"
      class:border-action={processArtifact.isValid}
      class:border-danger={!processArtifact.isValid}
      bind:value={processArtifact.value}
      class="w-full px-2 text-6xl bg-transparent border border-gray-300 outline-none rounded-xl text-primary" />
  </div>
{/if}
