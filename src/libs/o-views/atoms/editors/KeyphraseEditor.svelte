<script lang="ts">
  import { ProcessArtifact } from "../../../o-processes/interfaces/processArtifact";
  import { config } from "../../../o-circles-protocol/config";
  import { createEventDispatcher, onMount } from "svelte";
  import { mnemonicToEntropy } from "bip39";

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
      try {
        const privateKey = mnemonicToEntropy(processArtifact.value);
        const ownerAddress = config
          .getCurrent()
          .web3()
          .eth.accounts.privateKeyToAccount("0x" + privateKey).address;

        processArtifact.isValid = config
          .getCurrent()
          .web3()
          .utils.isAddress(ownerAddress);
      } catch (e) {
        console.log("KeyphraseEditor. Validation failed:", e);
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
    <textarea
      bind:value={processArtifact.value}
      readonly={processArtifact.isReadonly ? 'readonly' : ''}
      placeholder={processArtifact.placeholder ? processArtifact.placeholder : 'Word 1 Word 2 Wordd 3 ... Word 24'}
      class:border-action={processArtifact.isValid}
      class:border-danger={!processArtifact.isValid}
      class="w-full p-2 text-xl bg-transparent border-2 border-gray-300 outline-none rounded-xl text-primary" />
  </div>
{/if}
