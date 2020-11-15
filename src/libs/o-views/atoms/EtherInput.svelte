<script lang="ts">
  import { config } from "src/libs/o-circles-protocol/config";
  import { createEventDispatcher } from "svelte";
  import { BN } from "ethereumjs-util";

  const dispatch = createEventDispatcher();

  let isValid = false;

  export let ethValueString: string = "";
  export let weiValueBN: BN;
  export let label: string = "Label";

  let lastEthValue: string = "";
  let lastWeiValue: BN = new BN("0");

  $: {
    try {
      if (!weiValueBN.eq(lastWeiValue) && ethValueString == lastEthValue) {
        ethValueString = config.getCurrent().web3().utils.fromWei(weiValueBN);
      }

      const bn = new BN(ethValueString);
      weiValueBN = config.getCurrent().web3().utils.toWei(bn);

      dispatch("value", {
        type: "wei",
        data: weiValueBN,
      });

      isValid = true;
    } catch {
      isValid = false;
    }
    lastWeiValue = weiValueBN;
    lastEthValue = ethValueString;
  }
</script>

<div class="w-full">
  <p class="mb-1 text-xs text-gray-700 uppercase">{label}</p>

  <input
    placeholder="1"
    type="string"
    class:border={!isValid}
    class:border-red-500={!isValid}
    bind:value={ethValueString}
    class="w-full px-2 mb-2 text-6xl bg-transparent border border-gray-300 rounded text-primary" />
</div>
