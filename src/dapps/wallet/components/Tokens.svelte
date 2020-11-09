<script lang="ts">
  import { CirclesHub } from "../../../libs/o-circles-protocol/circles/circlesHub";
  import { Person } from "../../../libs/o-circles-protocol/model/person";
  import { config } from "../../../libs/o-circles-protocol/config";

  export let address: string;

  let person: Person;
  let tokensITrust: [] = [];

  function init(addr: string) {
    const hubAddress = config.getCurrent().HUB_ADDRESS;
    const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);

    person = new Person(circlesHub, addr);

    reload();
  }

  async function reload() {
    let t2 = await person.getTokenBalances();
    tokensITrust = Object.keys(t2)
      .map((k) => t2[k])
      .filter((o) => o.balanceString && o.balanceString !== "0");
    tokensITrust.sort((a, b) => -a.balance.cmp(b.balance));
  }

  $: {
    if (config.getCurrent().web3().utils.isAddress(address)) {
      init(address);
    }
  }
</script>

{#each tokensITrust as token}
  <div class="mx-4 mb-2">
    <div class="flex w-full bg-white border border-gray-300 rounded">
      <div class="flex-1 w-2/3 px-4 py-2 text-base">
        <!-- <b class="text-primary">{token.token}</b> -->
        <p class="-mt-1 text-xs">
          {#if !token.limit || token.limit == 0}
            <b class="text-primary">
              <a
                href="#/wallet/{token.owner.address}/tokens"
                class="">{token.owner.address.slice(0, 25)}...</a>
            </b>
          {:else}
            <b class="text-primary">
              <span class="text-gray-500">safe address of owner:</span>
              <a
                href="#/wallet/{token.owner.address}/tokens">{token.owner.address.slice(0, 25)}...</a>
            </b>
          {/if}
        </p>
      </div>
      <div class="w-1/3 h-12 px-3 py-1 text-2xl text-right text-primary">
        {token.balanceString}
      </div>
    </div>
  </div>
{/each}
