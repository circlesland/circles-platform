<script lang="ts">
  import { CirclesHub } from "src/libs/o-circles-protocol/circles/circlesHub";
  import { Person } from "src/libs/o-circles-protocol/model/person";
  import { config } from "src/libs/o-circles-protocol/config";
  import type { BN } from "ethereumjs-util";

  import { Jumper } from "svelte-loading-spinners";
  import Account from "./Account.svelte";
  import {Subscription} from "rxjs";
  import {OmoEvent} from "../../../../libs/o-events/omoEvent";
  import {onDestroy, onMount} from "svelte";
  import {asyncWaterfall} from "webnative/common";

  export let address: string;

  let person: Person;
  let balance: BN;
  let safeEthBalance: BN;
  let personalEthBalance: BN;

  let circlesBalance: string;
  let safeEtherBalance: string;
  let personalEtherBalance: string;

  async function init() {
    address = (await window.o.safe()).address;
    const hubAddress = config.getCurrent().HUB_ADDRESS;
    const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);

    person = new Person(circlesHub, address);

    reload();
  }

  async function reload() {
    const web3 = config.getCurrent().web3();
    const safe = await window.o.safe()

    balance = await person.getTokenBalance();
    const balanceStr = web3.utils.fromWei(balance, "ether");
    const dot = balanceStr.indexOf(".");
    circlesBalance = balanceStr.slice(0, dot + 3);

    safeEthBalance = await person.getEthBalance();
    const ethBalanceStr = web3.utils.fromWei(safeEthBalance, "ether");
    const ethDot = ethBalanceStr.indexOf(".");
    safeEtherBalance = ethBalanceStr.slice(0, ethDot + 7);

    personalEthBalance = await web3.eth.getBalance(safe.owner);
    const personalEthBalanceStr = web3.utils.fromWei(
      personalEthBalance,
      "ether"
    );
    const personalEthDot = personalEthBalanceStr.indexOf(".");
    personalEtherBalance = personalEthBalanceStr.slice(0, personalEthDot + 7);
  }

  let subscription: Subscription = window.o.events.subscribe((event: OmoEvent) =>
    {
      if (event.type === "shell.refreshView")
      {
        init();
      }
    });

  onDestroy(() =>
  {
    if (!subscription)
      return;

    subscription.unsubscribe();
    subscription = null;
  });

  onMount(() => init());
</script>

<div
  class="flex items-center justify-center h-full font-bold text-center text-white bg-primary md:rounded-xl">
  {#if circlesBalance != undefined}
    <div
      class="flex items-center justify-center pl-6 mx-auto text-6xl uppercase">
      {circlesBalance}
      <span><img
          src="images/logo/crc.svg"
          class="h-8 pt-1 pl-2"
          alt="CRC" /></span>
    </div>
  {:else}
    <div class="flex items-center justify-center mx-auto">
      <Jumper size="60" color="#fff" unit="px" />
    </div>
  {/if}
</div>
