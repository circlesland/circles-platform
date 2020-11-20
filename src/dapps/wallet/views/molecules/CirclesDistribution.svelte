<script lang="ts">
  import { CirclesHub } from "src/libs/o-circles-protocol/circles/circlesHub";
  import { Person } from "src/libs/o-circles-protocol/model/person";
  import { config } from "src/libs/o-circles-protocol/config";
  import { Jumper } from "svelte-loading-spinners";
  import TokenItem from "src/libs/o-views/molecules/TokenItem.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";

  export let address: string;

  let person: Person;
  let tokensITrust: any[] = [];

  function init(addr: string) {
    const hubAddress = config.getCurrent().HUB_ADDRESS;
    const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);

    person = new Person(circlesHub, addr);

    reload();
  }

  async function reload() {
    const web3 = config.getCurrent().web3();

    let t2 = await person.getTokenBalances();
    tokensITrust = Object.keys(t2)
      .map((k) => t2[k])
      .filter((o) => o.balanceString && o.balanceString !== "0")
      .map((token) => {
        return {
          image:
            "https://avatars.dicebear.com/api/avataaars/" +
            token.owner.address +
            ".svg ",
          balanceBN: token.balance,
          title: token.owner.address.slice(0, 8),
          description: token.owner.address,
          balance: token.balanceString,
          currency: "CRC",
        };
      });
    tokensITrust.sort((a, b) => -a.balanceBN.cmp(b.balanceBN));
  }

  $: {
    if (config.getCurrent().web3().utils.isAddress(address)) {
      init(address);
    }
  }
</script>

<div class="pl-1 text-gray-500 lowercase font-title">
  detailed circles distribution
</div>
<Compose gap="0.5rem" overflowY>
  {#if tokensITrust.length > 0}
    {#each tokensITrust as token}
      <TokenItem data={token} />
    {/each}
  {:else}
    <div class="flex items-center justify-center h-full mx-auto">
      <Jumper size="150" color="#071D69" unit="px" />
    </div>
  {/if}
</Compose>
