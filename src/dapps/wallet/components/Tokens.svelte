<script lang="ts">
  import { CirclesHub } from "../../../libs/o-circles-protocol/circles/circlesHub";
  import {Person} from "../../../libs/o-circles-protocol/model/person";
  import { config } from "../../../libs/o-circles-protocol/config";

  export let address:string;

  let person: Person;
  let tokensITrust:[] = [];

  function init(addr:string) {
    const hubAddress = config.getCurrent().HUB_ADDRESS;
    const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);

    person = new Person(circlesHub, addr);

    reload();
  }

  async function reload() {
    let t2  = await person.getTokenBalances();
    tokensITrust = Object.keys(t2).map(k => t2[k]).filter(o => o.balanceString !== "0");
  }

  $:{
    init(address);
  }
</script>

<b class="text-primary mx-4">Token balance:</b>
{#each tokensITrust as token}
  <div class="mx-4 mb- 2">
    <div class="flex w-full bg-white border border-gray-300 rounded">
      <div class="flex-1 px-4 py-2 text-base">
      </div>
    </div>
  </div>
  <div class="mx-4 mb- 2">
    <div class="flex w-full bg-white border border-gray-300 rounded">
      <div class="flex-1 px-4 py-2 text-base">
        <b class="text-primary">{token.token}</b>
        <p class="-mt-1 text-xs text-gray-500">
            owner: <a href="#/wallet/{token.owner.address}/tokens">{token.owner.address}</a>
        </p>
      </div>
      <div class="h-12 px-3 py-1 text-3xl text-green-500">
        {token.balanceString}
      </div>
    </div>
  </div>
{/each}
