<script lang="ts">
  import { CirclesHub } from "../../../libs/o-circles-protocol/circles/circlesHub";
  import { Person } from "../../../libs/o-circles-protocol/model/person";
  import { config } from "../../../libs/o-circles-protocol/config";
  import type { BN } from "ethereumjs-util";

  import { Jumper } from "svelte-loading-spinners";

  export let address: string;

  let person: Person;
  let balance: BN;
  let safeEthBalance: BN;
  let personalEthBalance: BN;

  let circlesBalance: string;
  let safeEtherBalance: string;
  let personalEtherBalance: string;

  function init(address: string) {
    const hubAddress = config.getCurrent().HUB_ADDRESS;
    const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);

    person = new Person(circlesHub, address);

    reload();
  }

  async function reload() {
    const web3 = config.getCurrent().web3();

    balance = await person.getTokenBalance();
    const balanceStr = web3.utils.fromWei(balance, "ether");
    const dot = balanceStr.indexOf(".");
    circlesBalance = balanceStr.slice(0, dot + 3);

    safeEthBalance = await person.getEthBalance();
    const ethBalanceStr = web3.utils.fromWei(safeEthBalance, "ether");
    const ethDot = ethBalanceStr.indexOf(".");
    safeEtherBalance = ethBalanceStr.slice(0, ethDot + 7);

    personalEthBalance = await web3.eth.getBalance(
      localStorage.getItem("omo.address")
    );
    const personalEthBalanceStr = web3.utils.fromWei(
      personalEthBalance,
      "ether"
    );
    const personalEthDot = personalEthBalanceStr.indexOf(".");
    personalEtherBalance = personalEthBalanceStr.slice(0, personalEthDot + 7);
  }

  $: {
    if (config.getCurrent().web3().utils.isAddress(address)) {
      init(address);
    }
  }
</script>

<div
  class="flex items-center justify-center font-bold text-center text-white bg-primary">
  <div class="font-bold text-gray-100 uppercase">
    {#if circlesBalance != undefined}
      <p class="pt-4 text-5xl">
        {circlesBalance}
        <span class="text-xl text-gray-300">CRC</span>
      </p>
    {:else}
      <div class="flex items-center justify-center mx-auto">
        <Jumper size="60" color="#fff" unit="px" />
      </div>
    {/if}
    <!-- <span class="-mt-1 text-sm">Safe: {safeEtherBalance} xDai</span><br/> -->
    {#if personalEtherBalance != undefined}
      <p class="text-sm text-gray-400">{personalEtherBalance} xDai</p><br />
    {:else}
      <div class="flex items-center justify-center mx-auto">
        <Jumper size="30" color="#fff" unit="px" />
      </div>
    {/if}
  </div>
</div>
