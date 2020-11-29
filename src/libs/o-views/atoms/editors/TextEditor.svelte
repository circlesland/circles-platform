<script lang="ts">
  import {ProcessArtifact} from "../../../o-processes/interfaces/processArtifact";
  import {createEventDispatcher, onMount} from "svelte";

  export let processArtifact:ProcessArtifact;
  const dispatch = createEventDispatcher();

  function validate() {
    if ((!processArtifact.value || processArtifact.value.toString().trim() === "")
      && processArtifact.isOptional)
    {
      processArtifact.isValid = true;
    }
    else if (processArtifact.value)
    {
      processArtifact.isValid = processArtifact.value.toString().trim() !== "";
    }
    dispatch('validated', processArtifact.isValid);
  }

  $:{
    if (processArtifact)
    {
      validate();
    }
  }

  onMount(() =>
  {
    validate();
  });
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
      class="w-full"
      bind:value={processArtifact.value}></textarea>
  </div>
{/if}
