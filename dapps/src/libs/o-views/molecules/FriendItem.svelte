<script lang="ts">
  import {
    setTrust,
    SetTrustContext,
  } from "../../../dapps/safe/processes/circles/setTrust";
  import ButtonIcon from "../atoms/ButtonIcon.svelte";

  import Icon from "fa-svelte";
  import {
    faArrowLeft,
    faArrowRight,
    faExchangeAlt,
    faHeart,
    faMinus,
    faMinusCircle,
    faMoneyBill,
  } from "@fortawesome/free-solid-svg-icons";
  import {
    unTrust,
    UnTrustContext,
  } from "../../../dapps/safe/processes/circles/unTrust";
  import {
    transferCircles,
    TransferCirclesContext,
  } from "../../../dapps/safe/processes/circles/transferCircles";
  import {OmoSafeState} from "../../../dapps/safe/manifest";
  import OmosapienAvatar from "../atoms/OmosapienAvatar.svelte";
  import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
  import {RunProcess} from "omo-process/dist/events/runProcess";
  import {tryGetDappState} from "omo-kernel/dist/kernel";
  import {BN} from "ethereumjs-util";
  import {config} from "omo-circles/dist/config";
  import {CirclesHub} from "omo-circles/dist/circles/circlesHub";
  import IpfsImage from "../atoms/IpfsImage.svelte";

  export let showActions: boolean = true;
  export let data = {
    image: "",
    title: "",
    detail: {
      fissionUsername: "",
      address: "",
      trust: {
        in: 0,
        out: 0
      },
    },
    actions: [],
  };

  $:{
    if (data && showActions) {
      if (data.detail.trust.in > 0 && data.detail.trust.out === null)
        data.actions = ["trust", "send"];
      if (data.detail.trust.in > 0 && data.detail.trust.out > 0)
        data.actions = ["untrust", "send"];
      if (data.detail.trust.out > 0 && data.detail.trust.in === null)
        data.actions = ["untrust"];
      if (data.detail.trust.out == 0)
        data.actions = ["trust"];
    }
    if (data && !showActions) {
      data.actions = [];
    }
  }

  let openDetail: boolean = false;

  function toggleExpand() {
    openDetail = !openDetail;
  }

  async function runTransferCircles(recipientAddress: string) {
    // const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
    // const myBalance = safeState.myBalances.getValue().payload.map(o => o.balance).reduce((p, c) => p.add(c), new BN(""));

    window.o.publishEvent(
      new RunProcess<TransferCirclesContext>(transferCircles, async ctx => {
        // ctx.myBalance = myBalance;
        ctx.web3 = config.getCurrent().web3();
        ctx.circlesHub = new CirclesHub(ctx.web3, config.getCurrent().HUB_ADDRESS);
        ctx.data.recipient = <ProcessArtifact>{
          key: "recipient",
          type: "ethereumAddress",
          value: recipientAddress,
        };
        return ctx;
      })
    );
  }

  function runTrust(recipientAddress: string) {
    window.o.publishEvent(new RunProcess<SetTrustContext>(setTrust, async (ctx: SetTrustContext) => {
      ctx.web3 = config.getCurrent().web3();
      ctx.circlesHub = new CirclesHub(ctx.web3, config.getCurrent().HUB_ADDRESS);
      ctx.data.trustReceiver = {
        type: "ethereumAddress",
        isReadonly: true,
        key: "trustReceiver",
        value: recipientAddress,
      };
      return ctx;
    }));
  }

  function runUntrust(recipientAddress: string) {
    window.o.publishEvent(new RunProcess<UnTrustContext>(unTrust, async (ctx: UnTrustContext) => {
      ctx.web3 = config.getCurrent().web3();
      ctx.circlesHub = new CirclesHub(ctx.web3, config.getCurrent().HUB_ADDRESS);
      ctx.data.trustReceiver = {
        type: "ethereumAddress",
        isReadonly: true,
        key: "trustReceiver",
        value: recipientAddress,
      };
      return ctx;
    }));
  }

  const sendMoney = {
    design: {
      icon: faMoneyBill,
      type: "primary",
    },
  };
  const addTrust = {
    design: {
      icon: faHeart,
      type: "primary",
    },
  };
  const removeTrust = {
    design: {
      icon: faMinus,
      type: "light-danger",
    },
  };
</script>

<style>
  .card {
    display: grid;
    grid-template-columns: 3.5rem 1fr auto;
    grid-template-rows: 3.5rem;
    max-width: 100%;
    overflow: hidden;
  }
</style>

<div>
  <div
    on:click={() => toggleExpand()}
    class="w-full bg-white border rounded-xl card border-light-200">
    <div class="flex items-center justify-center p-2">
      {#if data.detail && data.detail.fissionUsername}
        <!--<IpfsImage cid={omosapien.myProfile.omoAvatarCid} mimeType={omosapien.myProfile.omoAvatarMimeType}></IpfsImage>-->
        <OmosapienAvatar fissionUsername={data.detail.fissionUsername}></OmosapienAvatar>
      {:else}
        <img src={data.image} alt="CRC" class="rounded-xl" />
      {/if}
    </div>
    <div class="flex items-center">
      <div class="p-2">
        <div class="text-xs md:text-base text-primary">{data.title}</div>
        <p class="text-gray-500 text-xxs md:text-xs ">
          {#if data.detail.trust.in > 0 && data.detail.trust.out > 0} <!-- mutual trust -->
            <Icon icon={faExchangeAlt} /><span class="ml-2"> mutual trust</span>
          {:else if data.detail.trust.in > 0 && data.detail.trust.out === null} <!-- is only trusting me -->
            <Icon icon={faArrowRight} /><span class="ml-2">
              is trusting you</span>
          {:else if data.detail.trust.out > 0 && data.detail.trust.in === null} <!-- is only trusted by me -->
            <Icon icon={faArrowLeft} /><span class="ml-2"> trusted by you</span>
          {:else}
            <Icon icon={faMinusCircle} /><span class="ml-2">
              revoked trust</span>
          {/if}
        </p>
      </div>
    </div>
    <div class="flex justify-end p-2 space-x-2 overflow-hidden text-right">
      {#each data.actions as a}
        {#if a == 'send'}
          <div
            on:click={(e) => {
              runTransferCircles(data.detail.address);
              e.preventDefault();
              e.stopPropagation();
            }}>
            <ButtonIcon mapping={sendMoney} />
          </div>
        {:else if a == 'trust'}
          <div
            on:click={(e) => {
              runTrust(data.detail.address);
              e.preventDefault();
              e.stopPropagation();
            }}>
            <ButtonIcon mapping={addTrust} />
          </div>
        {:else if a == 'untrust'}
          <div
            on:click={(e) => {
              runUntrust(data.detail.address);
              e.preventDefault();
              e.stopPropagation();
            }}>
            <ButtonIcon mapping={removeTrust} />
          </div>
        {/if}
      {/each}
    </div>
  </div>

  {#if data.detail && openDetail}
    <div class="px-3">
      <div
        class="w-full p-2 overflow-hidden text-gray-500 bg-white border-b border-l border-r rounded-b-xl text-xxs md:text-xs border-light-200 ">
        <div>
          Address:<br /><span class=" text-primary">{data.detail.address}</span>
        </div>
        <div>
          {#if data.detail.trust.out}
            I trust:<span
            class="pl-2 text-primary">{data.detail.trust.out}%</span>
          {/if}<br/>
          {#if data.detail.trust.in}
            I'm trusted:<span
            class="pl-2 text-primary">{data.detail.trust.in}%</span><br/>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>
