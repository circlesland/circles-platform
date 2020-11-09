<script lang="ts">
  import { CirclesHub } from "../../../libs/o-circles-protocol/circles/circlesHub";
  import { Person } from "../../../libs/o-circles-protocol/model/person";
  import { config } from "../../../libs/o-circles-protocol/config";
  import type {Address} from "../../../libs/o-circles-protocol/interfaces/address";

  export let address:string;

  let person: Person;
  let transactions = [];

  function init(address:Address) {
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
    transactions = allTransactions;
  }

  $:{
    init(address);
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
          {#if t.from !== "0x0000000000000000000000000000000000000000"}
            from: <a href="#/wallet/{t.from}/safe">{t.from}</a>
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
