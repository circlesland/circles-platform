<script lang="ts">
  import {ProcessArtifact} from "../../../o-processes/interfaces/processArtifact";
  import {config} from "../../../o-circles-protocol/config";
  import {BN} from "ethereumjs-util";
  import {createEventDispatcher, onMount} from "svelte";

  export let processArtifact:ProcessArtifact;
  const dispatch = createEventDispatcher();

  function validate() {
    const web3 = config.getCurrent().web3();
    try {
      const weiStr = web3.utils.toWei(processArtifact.value.toString(), "ether");
      const weiValueBN = new BN(weiStr);
      processArtifact.isValid =
        processArtifact.value.toString().trim() !== ""
        && weiValueBN !== undefined
        && !weiValueBN.eq(new BN("0"))
        && !weiValueBN.isNeg();
    } catch (e) {
      console.warn("EtherInput validation failed:", e);
      processArtifact.isValid = false;
    }
    dispatch('isValidChanged', processArtifact.isValid);
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
      placeholder={processArtifact.placeholder ? processArtifact.placeholder : ""}
      type="number"
      class:border={!processArtifact.isValid}
      class:border-red-500={!processArtifact.isValid}
      bind:value={processArtifact.value}
      class="w-full px-2 mb-2 text-6xl bg-transparent border border-gray-300 rounded text-primary" />
  </div>
{/if}
