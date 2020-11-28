<script lang="ts">
  import {ProcessArtifact} from "../../../o-processes/interfaces/processArtifact";
  import {createEventDispatcher} from "svelte";

  export let processArtifact:ProcessArtifact;
  const dispatch = createEventDispatcher();
  $:{
    processArtifact.isValid = processArtifact.isValid || true;
    dispatch('isValidChanged', processArtifact.isValid);
  }
</script>

{#if processArtifact}
  <div class="w-full">
    {#if processArtifact.label}
      <p class="mb-1 text-xs text-gray-700 uppercase">{processArtifact.label}</p>
    {/if}
    <textarea
      readonly={processArtifact.isReadonly ? 'readonly' : ''}
      placeholder={processArtifact.placeholder ? processArtifact.placeholder : "Lorem ipsum dolor .."}
      class:border={!processArtifact.isValid}
      class:border-red-500={!processArtifact.isValid}
      bind:value={processArtifact.value}></textarea>
  </div>
{/if}
