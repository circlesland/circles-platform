<script lang="ts">
  import ProcessNav from "./libs/o-views/molecules/ProcessNav.svelte";
  import Compose from "./libs/o-views/atoms/Compose.svelte";

  import ComposeApp from "./libs/o-views/atoms/ComposeApp.svelte";
  import Router, { push } from "svelte-spa-router";
  import routes from "./libs/o-os/loader";

  import "./libs/o-views/css/base.css";
  import "./libs/o-views/css/components.css";
  import "./libs/o-views/css/utilities.css";

  import OverflowAction from "./libs/o-views/atoms/OverflowAction.svelte";
  import ActionBar from "./libs/o-views/molecules/ActionBar.svelte";
  import Modal from "./libs/o-views/molecules/Modal.svelte";
  import type { OmoEvent } from "./libs/o-events/omoEvent";
  import { RunProcess } from "./libs/o-events/runProcess";
  import ProcessContainer from "./libs/o-views/molecules/ProcessContainer.svelte";
  import { Cancel } from "./libs/o-processes/events/cancel";
  import { Process } from "./libs/o-processes/interfaces/process";
  import { ProgressSignal } from "./libs/o-circles-protocol/interfaces/blockchainEvent";
  import { onMount } from "svelte";

  let actions = [];

  let headerElement: HTMLElement;
  let contentElement: HTMLElement;
  let footerElement: HTMLElement;
  let windowInnerHeight: number;
  let contentHeight: number = 0;

  let isOpen = false;
  let showActionBar = false;

  let runningProcess: Process = window.o.stateMachines.current();

  let progressIndicator: {
    message: string;
    percent: number;
  };

  window.o.events.subscribe(async (event: OmoEvent) => {
    // runningProcess = window.o.stateMachines.current();
    if (event.type === "shell.openMenu") {
      isOpen = true;
    }
    if (event.type === "shell.closeModal") {
      isOpen = false;
    }
    if (event.type === "shell.openModal") {
      isOpen = true;
    }
    if (event.type == "shell.runProcess") {
      runningProcess = await window.o.stateMachines.run(
        (<RunProcess>event).definition,
        (<RunProcess>event).contextModifier
      );
      isOpen = true;
    }
    if (event.type === "shell.begin") {
    }
    if (event.type === "shell.done") {
      progressIndicator = null;
    }
    if (event.type === "shell.progress") {
      const progressEvent: ProgressSignal = <ProgressSignal>event;
      progressIndicator = {
        message: progressEvent.message,
        percent: progressEvent.percent,
      };
    }
  });

  function routeLoading(e) {
    if (!e.detail.userData) return;

    showActionBar = e.detail.userData.showActionBar;
    actions = e.detail.userData.actions;
  }

  let quickActions: any[] = [];
  let overflowActions: any[] = [];

  $: {
    let _quickActions = actions.filter((o) => o.pos && o.pos !== "overflow");
    quickActions = [0, 1, 2, 3].map((index) => {
      let actionAt: any = _quickActions.find(
        (action) => action.pos == index + 1
      );
      actionAt = actionAt ?? {
        type: "trigger",
        pos: (index + 1).toString(),
        mapping: {
          data: {
            label: "",
          },
          design: {
            type: "",
          },
        },
      };
      return actionAt;
    });

    overflowActions = actions
      .filter((o) => !o.pos || o.pos === "overflow")
      .map((item) => {
        return {
          data: {
            label: item.mapping.data.label,
          },
          design: {
            type: "secondary",
          },
          event: item.event,
          type: item.type,
          pos: item.pos,
        };
      });

    const headerHeight = headerElement ? headerElement.clientHeight : 0;
    const footerHeight = footerElement ? footerElement.clientHeight : 0;
    contentHeight = windowInnerHeight - headerHeight - footerHeight;
  }

  function toggleOpen() {
    isOpen = !isOpen;
  }

  function modalWantsToClose() {
    isOpen = false;
    if (!runningProcess) {
      return;
    }
    runningProcess.sendEvent(new Cancel());
  }

  function conditionsFailed(event) {
    console.log(
      "Escaped redirect url:",
      encodeURIComponent(event.detail.location)
    );
    if (event.detail.userData && event.detail.userData.shellEvent) {
      // There are some cases where we don't want to route to a different page
      // but instead only use the route params to initiate a process
      //window.o.publishEvent(event.detail.userData.shellEvent);
    } else {
      push(
        `#/omosapien/authenticate/${encodeURIComponent(event.detail.location)}`
      );
    }
  }
</script>

<svelte:window bind:innerHeight={windowInnerHeight} />
<div class="appContainer font-primary bg-light-100">
  <div
    bind:this={headerElement}
    class="w-full p-2 text-sm text-yellow-800 bg-yellow-400 ">
    We are in early alpha testing, please let us know about any bugs you find or
    feedback you have via
    <a
      href="https://discord.gg/Rbhy4j9"
      class="px-1 text-white cursor-pointer hover:text-yellow-800">chat</a>or<a
      href="mailto:team@omo.earth"
      class="px-1 text-white cursor-pointer hover:text-yellow-800">mail</a>
  </div>
  <div
    bind:this={contentElement}
    style="margin:0 auto; height: {contentHeight}px; overflow: auto; margin-bottom: {showActionBar && footerElement ? footerElement.clientHeight : 0}px;">
    <Router
      {routes}
      on:conditionsFailed={conditionsFailed}
      on:routeLoading={routeLoading} />
  </div>
  {#if showActionBar}
    <div
      bind:this={footerElement}
      style="position: fixed; bottom: 0; width:100%;">
      <ActionBar on:actionButtonClick={toggleOpen} {quickActions} />
    </div>
  {/if}
</div>
<Modal bind:isOpen on:closeRequest={modalWantsToClose}>
  {#if runningProcess}
    <ProcessContainer
      process={runningProcess}
      on:stopped={() => {
        isOpen = false;
        runningProcess = null;
      }} />
  {:else}
    {#each overflowActions as action}
      <div class="w-full">
        <div class="space-y-2">
          <div on:click={() => window.o.publishEvent(action.event())}>
            <OverflowAction mapping={action} />
          </div>
        </div>
      </div>
    {/each}
    <ProcessNav bind:isOpen />
  {/if}
</Modal>
