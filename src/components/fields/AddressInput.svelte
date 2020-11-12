<script lang="ts">
  import { config } from "src/libs/o-circles-protocol/config";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let isValid = true;
  let hexByteString: string;

  $: {
    isValid = hexByteString && hexByteString.startsWith("0x");
    if (isValid) {
      isValid = config.getCurrent().web3().utils.isAddress(hexByteString);
    }
    if (isValid) {
      dispatch("value", {
        type: "address",
        data: hexByteString,
      });
    }
  }
</script>

{#if !isValid}Invalid value:<br />{/if}
<input
  placeholder="0x1234..."
  type="string"
  minlength="42"
  maxlength="42"
  bind:value={hexByteString} />
