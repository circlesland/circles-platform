<script lang="ts">
  import { config } from "src/libs/o-circles-protocol/config";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let isValid = true;
  let bigNumberString: string;

  $: {
    isValid = config.getCurrent().web3().utils.isBigNumber(bigNumberString);
    if (isValid) {
      const wei = config.getCurrent().web3().utils.toWei(bigNumberString);

      dispatch("value", {
        type: "wei",
        data: wei,
      });
    }
  }
</script>

{#if !isValid}Invalid value:<br />{/if}
<input placeholder="1" type="string" bind:value={bigNumberString} />
