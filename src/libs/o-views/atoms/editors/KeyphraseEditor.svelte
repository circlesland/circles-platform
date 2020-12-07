<script lang="ts">
  import { ProcessArtifact } from "../../../o-processes/interfaces/processArtifact";
  import { config } from "../../../o-circles-protocol/config";
  import { createEventDispatcher, onMount } from "svelte";
  import { mnemonicToEntropy } from "bip39";
  import { ByteString } from "../../../o-circles-protocol/interfaces/byteString";

  export let processArtifact: ProcessArtifact;
  const dispatch = createEventDispatcher();

  function isValidKeyPhrase(): boolean {
    const privateKey = mnemonicToEntropy(processArtifact.value);
    const ownerAddress = config
      .getCurrent()
      .web3()
      .eth.accounts.privateKeyToAccount("0x" + privateKey).address;

    return config.getCurrent().web3().utils.isAddress(ownerAddress);
  }

  function isValidHexKey(): boolean {
    if (!processArtifact.value) return false;

    let hexString: ByteString;

    if (
      processArtifact.value.startsWith("0x") &&
      processArtifact.value.length == 66
    ) {
      // prefixed hex string
      hexString = processArtifact.value.slice(2);
    } else if (processArtifact.value.length == 64) {
      // non prefixed hex string
      hexString = processArtifact.value;
    } else {
      return false;
    }

    const address = config
      .getCurrent()
      .web3()
      .eth.accounts.privateKeyToAccount("0x" + hexString).address;
    return config.getCurrent().web3().utils.isAddress(address);
  }

  function validate() {
    if (
      (!processArtifact.value ||
        processArtifact.value.toString().trim() === "") &&
      processArtifact.isOptional
    ) {
      processArtifact.isValid = true;
    } else {
      try {
        processArtifact.isValid = isValidHexKey() || isValidKeyPhrase();
      } catch (e) {
        console.log("KeyphraseEditor. Validation failed:", e);
        processArtifact.isValid = false;
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
      class="w-full h-24 p-2 text-xl bg-transparent border-2 border-gray-300 outline-none rounded-xl text-primary" />
  </div>
{/if}
