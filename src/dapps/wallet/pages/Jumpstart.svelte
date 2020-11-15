<script lang="ts">
    import MobileLayout from "src/libs/o-views/templates/MobileLayout.svelte";
    import MainFooter from "src/libs/o-views/templates/MainFooter.svelte";
    import {push} from "svelte-spa-router";
    import {onMount} from "svelte";
    import Process from "../../../libs/o-views/molecules/Process.svelte";
    import {ProcessContext} from "../../../libs/o-processes/processContext";
    import {transferXDai} from "../processes/transferXDai/transferXDai";
    import {BN} from "ethereumjs-util";
    import {config} from "../../../libs/o-circles-protocol/config";

    // http://localhost:5000/#/wallet/jumpstart/0x9B74661e83F6696AdF872576f886Dc5Eb569B0bD

    export let params = {};

    let mySafeAddress: string;

    onMount(() =>
    {
        mySafeAddress = localStorage.getItem("omo.safeAddress");
        if (!mySafeAddress)
        {
            push("/wallet/connect");
        }
    });

    /**
     * The address that should be funded
     */
    let address: string = null;
    let contextInitializer;

    $: {
        if (params.address)
        {
            address = params.address;
            contextInitializer = (processContext:ProcessContext) => {
                const transferXDaiContext = {
                    ...processContext,
                    transfer: {
                        recipient: {
                            type: "ethereumAddress",
                            data: params.address
                        },
                        value: {
                            type: "wei",
                            data: config.getCurrent().JUMPSTART_MONEY
                        }
                    }
                };
                return transferXDaiContext;
            }
        }
    }
    let header = {
        title: "Safe",
    };

    let process;

    function yes()
    {
        process = transferXDai;
    }

    function no()
    {
        push("/wallet/" + mySafeAddress + "/safe");
    }
</script>

<MobileLayout>
    <MainFooter>
        <main slot="main"
                class="grid p-8 overflow-hidden overflow-y-scroll text-center bg-light-100">
            <h1 class="text-3xl text-center font-title text-primary">
                {address} needs a jumpstart ..
            </h1>
            <p class="py-4 text-sm text-center text-gray-700">
                {address} asks you to pay for the required transactions fees to set everything up.<br/><br/>
                <b>Do you want to send {config.getCurrent().web3().utils.fromWei(config.getCurrent().JUMPSTART_MONEY).slice(0, 5)} xDai to {address}?</b>
            </p>
            <img src="https://thumbs.dreamstime.com/z/two-people-trying-to-jump-start-car-vector-illustration-41549471.jpg">
        </main>
        <footer slot="footer" class="p-4 bg-white border-t">
            {#if process}
                <Process on:stopped={() => process = null} contextInitializer={contextInitializer} definition={process}/>
            {:else}
                <div class="flex space-x-4">
                    <div class="w-full py-2 text-center text-white uppercase rounded cursor-pointer bg-primary"
                         on:click={() => yes()}>
                        Yes
                    </div>
                    <div class="w-full py-2 text-center text-white uppercase rounded cursor-pointer bg-primary"
                         on:click={() => no()}>
                        No
                    </div>
                </div>
            {/if}
        </footer>
    </MainFooter>
</MobileLayout>
