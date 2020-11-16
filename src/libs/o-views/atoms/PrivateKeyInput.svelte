<script lang="ts">
  import { config } from "src/libs/o-circles-protocol/config";
  import { createEventDispatcher } from "svelte";
  import { ByteString } from "../../o-circles-protocol/interfaces/byteString";
  import { mnemonicToEntropy } from "bip39";

  const dispatch = createEventDispatcher();

  let isValid = true;
  export let privateKeyPhrase: string;
  export let label: string;
  export let isReadonly: boolean = false;
  let privateKeyByteString: ByteString;

  $: {
    try {
      privateKeyByteString = mnemonicToEntropy(privateKeyPhrase);
      const account = config
        .getCurrent()
        .web3()
        .eth.accounts.privateKeyToAccount(privateKeyByteString);
      isValid = config.getCurrent().web3().utils.isAddress(account.address);
      if (isValid) {
        dispatch("value", {
          type: "bytestring",
          data: privateKeyByteString,
        });
      }
    } catch (e) {
      console.warn("PrivateKeyInput validation error:", e)
      isValid = false;
    }
  }
</script>

<div class="w-full">
  <p class="mb-1 text-xs text-gray-700 uppercase">{label}</p>
  <input
    readonly={isReadonly ? 'readonly' : ''}
    class:border={!isValid}
    class:border-red-500={!isValid}
    placeholder="word1 word2 word3 word4 .... word23 word24"
    type="text"
    bind:value={privateKeyPhrase}
    class="w-full h-24 px-2 mb-2 bg-transparent border border-gray-300 rounded text-primary" />
</div>
