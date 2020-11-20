<script lang="ts">
  import { CirclesHub } from "src/libs/o-circles-protocol/circles/circlesHub";
  import { Person } from "src/libs/o-circles-protocol/model/person";
  import { config } from "src/libs/o-circles-protocol/config";
  import type { Address } from "src/libs/o-circles-protocol/interfaces/address";
  import { BN } from "ethereumjs-util";
  import dayjs from "dayjs";
  import { Jumper } from "svelte-loading-spinners";
  import Account from "./Account.svelte";

  export let address: string;

  let person: Person;
  let transactions = [];

  function init(address: Address) {
    const hubAddress = config.getCurrent().HUB_ADDRESS;
    const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);

    person = new Person(circlesHub, address);

    reload();
  }

  async function reload() {
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
      probes.map(async (i) => await web3.eth.getBlock(latestBlockNo - i))
    );

    let latestTimestamp;
    let lastTimestamp = 0;
    let delta = 0;
    for (let block of blocks) {
      if (lastTimestamp == 0) {
        delta += 0;
      } else {
        delta += lastTimestamp - block.timestamp;
      }
      if (!latestTimestamp) {
        latestTimestamp = block.timestamp;
      }
      lastTimestamp = block.timestamp;
    }

    const latestBlockNoOnChain = new BN(latestBlockNo.toString());
    const timePerBlock = delta / (probes.length - 1);

    transactions = allTransactions.map((o) => {
      const blockDelta = latestBlockNoOnChain.sub(o.blockNo);
      const timeDelta = timePerBlock * blockDelta.toNumber();
      const thenTime = (latestTimestamp - timeDelta).toFixed(0);
      const estimatedBlockTime = new Date(thenTime * 1000);

      o.timestamp = estimatedBlockTime;
      return o;
    });
  }

  $: {
    if (config.getCurrent().web3().utils.isAddress(address)) {
      init(address);
    }
  }
</script>

<div class="h-full">
  {#if transactions.length > 0}
    <div class="m-4 space-y-2">
      {#each transactions as t}
        <div>
          <div
            class="flex w-full bg-white border border-gray-300 rounded"
            on:click={() => (t.openDetail = !t.openDetail)}>
            <div class="flex items-center justify-center w-10 text-sm ">
              <i
                class="text-light-400 fas"
                class:fa-plus={!t.openDetail}
                class:fa-minus={t.openDetail} />
            </div>
            <div class="flex-1 w-2/3 py-2 pr-2 text-sm">
              <b class="text-primary">
                {#if t.from !== '0x0000000000000000000000000000000000000000'}
                  {t.direction === 'in' ? 'Incoming' : 'Outgoing'}
                  {t.subject}
                {:else}Universal basic income{/if}
              </b>
              <p class="text-xs text-gray-500">
                {dayjs(t.timestamp).fromNow()}
                {#if t.direction === 'in'}
                  {#if t.from !== '0x0000000000000000000000000000000000000000'}
                    from
                    <!-- <a href="#/wallet/{t.from}/safe">-->
                    {t.from.slice(0, 12)}...

                    <!-- </a> -->
                  {:else}from MamaOmo{/if}
                {:else}
                  to
                  <!-- <a href="#/wallet/{t.to}/safe"> -->
                  {t.to.slice(0, 12)}...

                  <!-- </a> -->
                {/if}
              </p>
            </div>
            {#if t.direction === 'out'}
              <div
                class="w-1/3 h-12 px-3 py-1 text-3xl font-light text-right text-primary">
                <span>-{t.amount}</span>
              </div>
            {:else}
              <div
                class="w-1/3 h-12 px-3 py-2 text-3xl font-light text-right text-action">
                {t.amount}
              </div>
            {/if}
          </div>
          {#if t.openDetail}
            <div
              class="flex max-w-full p-4 text-xs text-gray-500 bg-white border-b border-x border-light-300">
              <div class="max-w-full text-gray-500 ">
                <div class="flex text-sm">
                  {#if t.from === '0x0000000000000000000000000000000000000000'}
                    <img
                      src="https://avatars.dicebear.com/api/avataaars/mama.svg"
                      alt="profile"
                      class="h-12" />
                  {:else}
                    <img
                      src="https://avatars.dicebear.com/api/avataaars/{t.from}.svg"
                      alt="profile"
                      class="h-12" />
                  {/if}
                  <div class="py-4 text-xl">
                    <i class="fas fa-arrow-right" />
                  </div>
                  <img
                    src="https://avatars.dicebear.com/api/avataaars/{t.to}.svg"
                    alt="profile"
                    class="h-12" />
                </div>
                <div class="max-w-full text-gray-500 ">
                  Date:
                  <span class="text-xs text-primary">
                    {dayjs(t.timestamp).format('YYYY D. MMM HH:MM')}</span>
                </div>
                <div>
                  Sender:
                  <span class="text-xs text-primary">{t.from}</span>
                </div>
                <div class="max-w-full text-gray-500 ">
                  Receiver:
                  <span class="text-xs text-primary">{t.to}</span>
                </div>
                <div class="max-w-full text-gray-500 ">
                  Amount:
                  <span
                    class="text-xs text-primary">{t.o.returnValues.value / 1000000000000000000}</span>
                </div>
                <!-- <div
                  class="justify-center my-2 text-xs uppercase text-secondary "
                  on:click={() => (t.openDetailPayload = !t.openDetailPayload)}>
                  Show Payload
                </div>
                {#if t.openDetailPayload}
                  <pre
                    class=" text-xxs">{JSON.stringify(t, null, 2)}
                    </pre>
                {/if} -->
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <div class="flex items-center justify-center h-full mx-auto">
      <Jumper size="150" color="#071D69" unit="px" />
    </div>
  {/if}
</div>
