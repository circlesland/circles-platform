<script lang="ts">
    import {config} from "src/libs/o-circles-protocol/config";
    import {createEventDispatcher} from "svelte";
    import {BN} from "ethereumjs-util";

    const dispatch = createEventDispatcher();

    let isValid = false;

    export let ethValueString: string = "";
    export let weiValueBN: BN;

    let lastEthValue:string = "";
    let lastWeiValue:BN = new BN("0");

    $: {
        try
        {
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
        }
        catch
        {
            isValid = false;
        }
        lastWeiValue = weiValueBN;
        lastEthValue = ethValueString;
    }
</script>

<input placeholder="1"
       type="string"
       class:border={!isValid}
       class:border-red-500={!isValid}
       bind:value={ethValueString}/>
