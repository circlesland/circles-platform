<script lang="ts">
  import { config } from "src/libs/o-circles-protocol/config";
  import { createEventDispatcher } from "svelte";
  import { BN } from "ethereumjs-util";

  const dispatch = createEventDispatcher();

  let isValid = false;

  export let ethValueString: string = "";
  export let weiValueBN: BN;
  export let label: string = "Label";
  export let isReadonly: boolean = false;

  let lastEthValue: string = "";
  let lastWeiValue: BN = new BN("0");

  $: {
    const web3 = config.getCurrent().web3();

    try {
      if (weiValueBN && !weiValueBN.eq(lastWeiValue) && ethValueString == lastEthValue) {
        ethValueString = web3.utils.fromWei(weiValueBN);
      }

      const weiStr = web3.utils.toWei(ethValueString.toString(), "ether");
      weiValueBN = new BN(weiStr);

      dispatch("value", {
        type: "wei",
        data: weiValueBN,
      });

      isValid = true;
    } catch (e) {
      console.warn("EtherInput validation failed:", e);
      isValid = false;
    }
    lastWeiValue = weiValueBN;
    lastEthValue = ethValueString;
  }
</script>

<div class="w-full">
  <p class="mb-1 text-xs text-gray-700 uppercase">{label}</p>

  <input
    readonly={isReadonly ? 'readonly' : ''}
    placeholder="0.0"
    type="number"
    class:border={!isValid}
    class:border-red-500={!isValid}
    bind:value={ethValueString}
    class="w-full px-2 mb-2 text-6xl bg-transparent border border-gray-300 rounded text-primary" />
</div>
