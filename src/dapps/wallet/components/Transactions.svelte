<script lang="ts">
  import { CirclesHub } from "../../../libs/o-circles-protocol/circles/circlesHub";
  import { Person } from "../../../libs/o-circles-protocol/model/person";
  import { config } from "../../../libs/o-circles-protocol/config";

  let person: Person;
  let transactions = [];

  function init() {
    const hubAddress = config.getCurrent().HUB_ADDRESS;
    const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);
    const safeAddress = localStorage.getItem("omo.safeAddress");

    person = new Person(circlesHub, safeAddress);

    reload();
  }

  async function reload() {
    const incomingTransactions = await person.getIncomingTransactions();
    const outgoingTransactions = await person.getOutgoingTransactions();
    const allTransactions = incomingTransactions.concat(outgoingTransactions);
    allTransactions.sort((a, b) => -a.blockNo.cmp(b.blockNo));
    transactions = allTransactions;
  }

  init();
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
          {#if t.from !== "0x0000000000000000000000000000000000000000"}
            from: {t.from}
          {:else}
            Circles
          {/if}
          <br/>
          in block: {t.blockNo}
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
