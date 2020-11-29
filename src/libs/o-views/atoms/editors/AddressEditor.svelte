<script lang="ts">
  import { ProcessArtifact } from "../../../o-processes/interfaces/processArtifact";
  import { config } from "../../../o-circles-protocol/config";
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
    } else {
      processArtifact.isValid =
        processArtifact.value && processArtifact.value.startsWith("0x");
      if (processArtifact.isValid) {
        processArtifact.isValid = config
          .getCurrent()
          .web3()
          .utils.isAddress(processArtifact.value);
      }
    }
    dispatch("validated", processArtifact.isValid);
  }

  $: {
    if (processArtifact && processArtifact.value) {
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
      class:border-action={processArtifact.isValid}
      class:border-danger={!processArtifact.isValid}
      placeholder={processArtifact.placeholder ? processArtifact.placeholder : '0x123XMaMaXOm0...'}
      type="text"
      minlength="42"
      maxlength="42"
      bind:value={processArtifact.value}
      class="w-full p-3 mb-2 text-xl bg-transparent border-2 border-gray-300 rounded-lg outline-none text-primary" />
  </div>
{/if}
