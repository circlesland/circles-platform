<script lang="ts">
  import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
  import {createEventDispatcher, onMount} from "svelte";
  import GeoSearch from "../GeoSearch.svelte";

  export let processArtifact: ProcessArtifact;
  const dispatch = createEventDispatcher();

  function validate()
  {
    console.log("LocationEditor.validate()")
    if (
      (!processArtifact.value ||
        !processArtifact.value.display_name) &&
      processArtifact.isOptional
    )
    {
      console.log("LocationEditor.validate() - not set and optional -> valid")
      processArtifact.isValid = true;
    }
    else if (processArtifact.value)
    {
      processArtifact.isValid = !!processArtifact.value.display_name;
      console.log("LocationEditor.validate() - has value -> ", processArtifact.isValid ? "valid" : "invalid")
    }
    else
    {
      console.log("LocationEditor.validate() - not optional and no value -> invalid")
      processArtifact.isValid = false;
    }
    console.log("LocationEditor.validate() - result:", processArtifact.isValid)
    dispatch("validated", processArtifact.isValid);
  }

  $: {
    if (processArtifact && processArtifact.value)
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
  <div
    class="border"
    class:border-action={processArtifact.isValid}
    class:border-danger={!processArtifact.isValid}>
    <GeoSearch processArtifact={processArtifact} on:validate={() => validate()}></GeoSearch>
  </div>
{/if}
