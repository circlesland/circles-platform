<script lang="ts">
  import { ProcessArtifact } from "../../../o-processes/interfaces/processArtifact";
  import { config } from "../../../o-circles-protocol/config";
  import { BN } from "ethereumjs-util";
  import { createEventDispatcher, onMount } from "svelte";

  export let processArtifact: ProcessArtifact;
  const dispatch = createEventDispatcher();

  function validate() {
    const web3 = config.getCurrent().web3();
    if (
      (!processArtifact.value ||
        processArtifact.value.toString().trim() === "") &&
      processArtifact.isOptional
    ) {
      processArtifact.isValid = true;
    } else {
      try {
        const weiStr = web3.utils.toWei(
          processArtifact.value.toString(),
          "ether"
        );
        const weiValueBN = new BN(weiStr);
        processArtifact.isValid =
          processArtifact.value.toString().trim() !== "" &&
          weiValueBN !== undefined &&
          !weiValueBN.eq(new BN("0")) &&
          !weiValueBN.isNeg();

        processArtifact.isValid = (processArtifact.isValid
          && !processArtifact.max)
          || (processArtifact.isValid && parseFloat(processArtifact.value) <= parseFloat(processArtifact.max.toString()));
      } catch (e) {
        console.warn("EtherInput validation failed:", e);
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
