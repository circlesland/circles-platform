<script lang="ts">
  import ProcessNav from "./libs/o-views/molecules/ProcessNav.svelte";
  import Compose from "./libs/o-views/atoms/Compose.svelte";
  import ComposeApp from "./libs/o-views/atoms/ComposeApp.svelte";
  import Router, {push} from "svelte-spa-router";
  import routes from "./libs/o-os/routes";

  import "./libs/o-views/css/base.css";
  import "./libs/o-views/css/components.css";
  import "./libs/o-views/css/utilities.css";

  import OverflowAction from "./libs/o-views/atoms/OverflowAction.svelte";
  import ActionBar from "./libs/o-views/molecules/ActionBar.svelte";
  import Modal from "./libs/o-views/molecules/Modal.svelte";
  import type { OmoEvent } from "./libs/o-events/omoEvent";
  import type { RunProcess } from "./libs/o-events/runProcess";
  import Announcement from "./libs/o-views/molecules/Announcement.svelte";
  import ProcessContainer from "./libs/o-views/molecules/ProcessContainer.svelte";
  import { Cancel } from "./libs/o-processes/events/cancel";
  import {Process} from "./libs/o-processes/interfaces/process";

  let actions = [];

  let alpha = {
    data: {
      type: "Attention",
      text: "We are in early alpha testing. For feedback join our",
      button: "Chat",
    },
    action: {
      link: "https://discord.gg/Rbhy4j9",
    },
  };

  let isOpen = false;
  let showActionBar = false;
  let askForCancel = false;

  let runningProcess: Process = window.o.stateMachines.current();

  window.o.shellEvents.subscribe((event: OmoEvent) => {
      runningProcess = window.o.stateMachines.current();
      if (event.type === "shell.openMenu") {
        isOpen = true;
      }
      if (event.type == "shell.runProcess") {
        runningProcess = window.o.stateMachines.run(
          (<RunProcess>event).definition,
          (<RunProcess>event).contextModifier
        );
        isOpen = true;
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
    console.log("Escaped redirect url:", encodeURIComponent(event.detail.location));
    push(`#/odentity/authenticate/${encodeURIComponent(event.detail.location)}`);
  }
</script>

<ComposeApp tw="font-primary bg-light-100">
  <Compose tw="mx-auto bg-light-100 w-full max-w-4xl">
    <Compose columns="1fr" rows="auto 1fr auto" tw="w-full">
      <Compose tw="md:my-1">
        <Announcement mapping={alpha} />
      </Compose>
      <Compose rows="1fr" columns="1fr">
        <Router {routes} on:conditionsFailed={conditionsFailed} on:routeLoading={routeLoading} />
      </Compose>
      {#if showActionBar}
        <Compose>
          <ActionBar
            on:actionButtonClick={toggleOpen}
            {quickActions} />
        </Compose>
      {/if}
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
                <div on:click={() => window.dispatchShellEvent(action.event())}>
                  <OverflowAction mapping={action} />
                </div>
              </div>
            </div>
          {/each}
          <ProcessNav bind:isOpen />
        {/if}
      </Modal>
    </Compose>
  </Compose>
</ComposeApp>
