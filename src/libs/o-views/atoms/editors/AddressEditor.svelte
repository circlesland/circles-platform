<script lang="ts">
  import {ProcessArtifact} from "../../../o-processes/interfaces/processArtifact";
  import {config} from "../../../o-circles-protocol/config";
  import {createEventDispatcher, onMount} from "svelte";

  export let processArtifact:ProcessArtifact;
  const dispatch = createEventDispatcher();

  function validate() {
    processArtifact.isValid = processArtifact.value && processArtifact.value.startsWith("0x");
    if (processArtifact.isValid)
    {
      processArtifact.isValid = config.getCurrent().web3().utils.isAddress(processArtifact.value);
    }
    dispatch('isValidChanged', processArtifact.isValid);
  }

  $:{
    if (processArtifact)
    {
      validate();
    }
  }

  $:{
    if (processArtifact)
    {
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
      <p class="mb-1 text-xs text-gray-700 uppercase">{processArtifact.label}</p>
    {/if}
  <input
    readonly={processArtifact.isReadonly ? 'readonly' : ''}
    class:border-2={!processArtifact.isValid}
    class:border-red-500={!processArtifact.isValid}
    placeholder={processArtifact.placeholder ? processArtifact.placeholder : "0x1234..."}
    type="text"
    minlength="42"
    maxlength="42"
    bind:value={processArtifact.value}
    class="w-full p-2 mb-2 text-xl bg-transparent border border-gray-300 rounded text-primary" />
</div>
{/if}
