<script lang="ts">
  import { config } from "src/libs/o-circles-protocol/config";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let isValid = true;
  export let hexByteString: string;
  export let isReadonly:boolean = false;

  $: {
    isValid = hexByteString && hexByteString.startsWith("0x");
    if (isValid) {
      isValid = config.getCurrent().web3().utils.isAddress(hexByteString);
    }
    if (isValid) {
      dispatch("value", {
        type: "ethereumAddress",
        data: hexByteString,
      });
    }
  }
</script>

<div>
    <input
      readonly="{isReadonly ? 'readonly' : ''}"
      class:border={!isValid}
      class:border-red-500={!isValid}
      placeholder="0x1234..."
      type="text"
      minlength="42"
      maxlength="42"
      bind:value={hexByteString} />
</div>
