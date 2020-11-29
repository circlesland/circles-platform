<script lang="ts">
  import {ProcessArtifact} from "../../../o-processes/interfaces/processArtifact";
  import {config} from "../../../o-circles-protocol/config";
  import {createEventDispatcher, onMount} from "svelte";
  import {mnemonicToEntropy} from "bip39";

  export let processArtifact:ProcessArtifact;
  const dispatch = createEventDispatcher();

  function validate() {
    if ((!processArtifact.value || processArtifact.value.toString().trim() === "")
      && processArtifact.isOptional)
    {
      processArtifact.isValid = true;
    }
    else
    {
      try
      {
        const privateKey = mnemonicToEntropy(processArtifact.value);
        const ownerAddress = config.getCurrent().web3()
          .eth
          .accounts
          .privateKeyToAccount("0x" + privateKey)
          .address;

        processArtifact.isValid = config.getCurrent().web3().utils.isAddress(ownerAddress);
      } catch(e) {
        console.log("KeyphraseEditor. Validation failed:", e);
      }
    }
    dispatch('validated', processArtifact.isValid);
  }

  $:{
    if (processArtifact && processArtifact.value)
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
    <textarea
      readonly={processArtifact.isReadonly ? 'readonly' : ''}
      placeholder={processArtifact.placeholder ? processArtifact.placeholder : "Lorem ipsum dolor .."}
      class:border={!processArtifact.isValid}
      class:border-red-500={!processArtifact.isValid}
      class="w-full"
      bind:value={processArtifact.value}></textarea>
  </div>
{/if}
