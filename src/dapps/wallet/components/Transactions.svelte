<script lang="ts">
    import {CirclesHub} from "../../../libs/o-circles-protocol/circles/circlesHub";
    import {Person} from "../../../libs/o-circles-protocol/model/person";
    import {config} from "../../../libs/o-circles-protocol/config";
    import type {Address} from "../../../libs/o-circles-protocol/interfaces/address";
    import {BN} from "ethereumjs-util";

    export let address: string;

    let person: Person;
    let transactions = [];

    function init(address: Address)
    {
        const hubAddress = config.getCurrent().HUB_ADDRESS;
        const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);

        person = new Person(circlesHub, address);

        reload();
    }

    async function reload()
    {
        const incomingTransactions = await person.getIncomingTransactions();
        const outgoingTransactions = await person.getOutgoingTransactions();
        const allTransactions = incomingTransactions.concat(outgoingTransactions);
        allTransactions.sort((a, b) => -a.blockNo.cmp(b.blockNo));

        const web3 = config.getCurrent().web3();
        const latestBlockNo = await web3.eth.getBlockNumber();

        //
        // Get the measures for a time estimation from the latest 2 block of the chain.
        //
        const probes = [0, 1];
        const blocks = await Promise.all(
            probes.map(async i => await web3.eth.getBlock(latestBlockNo - i))
        );

        let latestTimestamp;
        let lastTimestamp = 0;
        let delta = 0;
        for (let block of blocks)
        {
            if (lastTimestamp == 0)
            {
                delta += 0
            }
            else
            {
                delta += lastTimestamp - block.timestamp;
            }
            if (!latestTimestamp) {
                latestTimestamp = block.timestamp;
            }
            lastTimestamp = block.timestamp;
        }

        const latestBlockNoOnChain = new BN(latestBlockNo.toString());
        const timePerBlock = delta / (probes.length - 1);

        transactions = allTransactions.map(o =>
        {
            const blockDelta = latestBlockNoOnChain.sub(o.blockNo);
            const timeDelta = timePerBlock * blockDelta.toNumber();
            const thenTime = (latestTimestamp - timeDelta).toFixed(0);
            const estimatedBlockTime = new Date(thenTime * 1000);

            o.timestamp = estimatedBlockTime.getUTCFullYear()
                + "-" + ("0" + estimatedBlockTime.getUTCMonth()).slice(-2)
                + "-" + ("0" + estimatedBlockTime.getUTCDate()).slice(-2)
                + " " + ("0" + estimatedBlockTime.getUTCHours()).slice(-2)
                + ":" + ("0" + estimatedBlockTime.getUTCMinutes()).slice(-2)
                + ":" + ("0" + estimatedBlockTime.getUTCSeconds()).slice(-2);

            return o;
        });
    }

    $:{
        if (config.getCurrent().web3().utils.isAddress(address))
        {
            init(address);
        }
    }
</script>

{#each transactions as t}
    <div class="mx-4 mb- 2">
        <div class="flex w-full bg-white border border-gray-300 rounded">
            <div class="flex-1 px-4 py-2 text-base">
                <b class="text-primary">
                    {#if t.from !== "0x0000000000000000000000000000000000000000"}
                        {t.direction === 'in' ? 'Incoming' : 'Outgoing'}
                        {t.subject}
                    {:else}
                        UBI payment
                    {/if}
                </b>
                <p class="-mt-1 text-xs text-gray-500">
                    at: {t.timestamp}<br/>
                    {#if t.direction === 'in'}
                        {#if t.from !== "0x0000000000000000000000000000000000000000"}
                            from: <a href="#/wallet/{t.from}/safe">{t.from}</a>
                        {:else}
                            Circles
                        {/if}
                    {:else}
                        to: <a href="#/wallet/{t.to}/safe">{t.to}</a>
                    {/if}
                    <br/>
                </p>
            </div>
            {#if t.direction === 'out'}
                <div class="h-12 px-3 py-1 text-3xl text-red-500">
                    - {t.amount}
                </div>
            {:else}
                <div class="h-12 px-3 py-1 text-3xl text-green-500">
                    {t.amount}
                </div>
            {/if}
        </div>
    </div>
{/each}
