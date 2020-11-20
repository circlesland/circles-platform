<script lang="ts">
  import ProcessNav from "./libs/o-views/molecules/ProcessNav.svelte";
  import Compose from "./libs/o-views/atoms/Compose.svelte";
  import ComposeApp from "./libs/o-views/atoms/ComposeApp.svelte";
  import Router from "svelte-spa-router";
  import routes from "src/routes";
  import Tailwind from "src/Tailwind.svelte";
  import { getLocaleFromNavigator, addMessages, init } from "svelte-i18n";
  import { _ } from "svelte-i18n";

  import omo_en from "src/dapps/omo/data/languages/en.json";
  import omo_de from "src/dapps/omo/data/languages/de.json";

  import website_en from "src/dapps/website/data/languages/en.json";
  import website_de from "src/dapps/website/data/languages/de.json";
  import wallet_de from "src/dapps/wallet/data/languages/de.json";
  import wallet_en from "src/dapps/wallet/data/languages/en.json";
  import identity_de from "src/dapps/identity/data/languages/de.json";
  import identity_en from "src/dapps/identity/data/languages/en.json";

  import Button from "./libs/o-views/atoms/Button.svelte";
  import ActionBar from "./libs/o-views/molecules/ActionBar.svelte";
  import Modal from "./libs/o-views/molecules/Modal.svelte";
  import { OmoEvent } from "./libs/o-events/omoEvent";
  import { RunProcess } from "./libs/o-events/runProcess";
  import Process from "./libs/o-views/molecules/Process.svelte";
  import { onMount } from "svelte";
  import Notifications from "./libs/o-views/molecules/Notifications.svelte";

  let safeAddress;

  onMount(() => {});

  let notes_en = {
    notes_text:
      "This dapp is an early alpha test version. For feedback join our",
    notes_button: "chat",
  };
  let notes_de = {
    notes_text:
      "Diese App is noch in früher Testphase. Für Feedback schreib uns im",
    notes_button: "chat",
  };

  addMessages("en", omo_en, website_en, notes_en, wallet_en, identity_en);
  addMessages("de", omo_de, website_de, notes_de, wallet_de, identity_de);

  init({
    fallbackLocale: "en",
    initialLocale: getLocaleFromNavigator(),
  });

  let actions = [];

  let isOpen = false;
  let runningProcess: Process = window.stateMachines.current();

  window.eventBroker
    .getTopic("omo", "shell")
    .observable.subscribe((event: OmoEvent) => {
      runningProcess = window.stateMachines.current();
      if (event.type === "openMenu") {
        isOpen = true;
      }
      if (event.type == "runProcess") {
        runningProcess = window.stateMachines.run(
          (<RunProcess>event).definition,
          (<RunProcess>event).contextModifier
        );
        isOpen = true;
      }
    });

  function routeLoading(e) {
    safeAddress = localStorage.getItem("omo.safeAddress");

    if (!e.detail.userData) return;

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
        icon: "",
        label: "",
      };
      return actionAt;
    });

    overflowActions = actions.filter((o) => !o.pos || o.pos === "overflow");
    console.log(overflowActions);
  }

  function toggleOpen() {
    isOpen = !isOpen;
  }

  function modalWantsToClose() {
    runningProcess = window.stateMachines.current();
    if (runningProcess) {
    } else {
      isOpen = false;
    }
  }
</script>

<Tailwind />

<ComposeApp tw="font-primary bg-light-300">
  <Compose tw="mx-auto bg-light-100 w-full max-w-2xl">
    <Compose columns="1fr" rows="auto 1fr auto" tw="w-full">
      <Compose>
        <Notifications />
      </Compose>
      <Compose>
        <Router {routes} on:routeLoading={routeLoading} />
      </Compose>
      <ActionBar
        bind:safeAddress
        on:actionButtonClick={toggleOpen}
        {quickActions} />
      <Modal bind:isOpen on:closeRequest={modalWantsToClose}>
        {#if runningProcess}
          <Process
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
                  <Button text={action.label} type="secondary" />
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
