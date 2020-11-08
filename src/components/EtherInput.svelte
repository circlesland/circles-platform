<script lang="ts">
    import {BN} from "ethereumjs-util";
    import {config} from "../libs/o-circles-protocol/config";
    import {createEventDispatcher} from "svelte";

    let text:string = "0";

    const dispatch = createEventDispatcher();

    export let isValid = true;
    export let data:BN = new BN("0");

    $:{
        if (text && text.length > 0) {
            isValid = true;
            try
            {
                data = config.getCurrent().web3().utils.toWei(text.toString(), "ether");
                dispatch('data', {
                    type: "wei",
                    data: data
                });
            } catch (e) {
                isValid = false;
            }
        }
    }
</script>
<input type="number" bind:value={text} />
