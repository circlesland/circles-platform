<script lang="ts">
  import Router from "svelte-spa-router";
  import routes from "src/routes";
  import Tailwind from "src/Tailwind.svelte";
  import {getLocaleFromNavigator, addMessages, init} from "svelte-i18n";
  import {_} from "svelte-i18n";

  import omo_en from "src/dapps/omo/languages/en.json";
  import omo_de from "src/dapps/omo/languages/de.json";

  import website_en from "src/dapps/website/languages/en.json";
  import website_de from "src/dapps/website/languages/de.json";
  import wallet_de from "src/dapps/wallet/languages/de.json";
  import wallet_en from "src/dapps/wallet/languages/en.json";
  import identity_de from "src/dapps/identity/languages/de.json";
  import identity_en from "src/dapps/identity/languages/en.json";
  import Composite from "./libs/o-views/atoms/Composite.svelte";
  import Leaf from "./libs/o-views/atoms/Leaf.svelte";
  import Button from "./libs/o-views/atoms/Button.svelte";
  import ActionBar from "./libs/o-views/molecules/ActionBar.svelte";
  import Modal from "./libs/o-views/molecules/Modal.svelte";
  import {OmoEvent} from "./libs/o-events/omoEvent";
  import {RunProcess} from "./libs/o-events/runProcess";
  import Process from "./libs/o-views/molecules/Process.svelte";

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

  let layout1 = {
    areas: "'top''bottom'",
    columns: "1fr",
    rows: "1fr 1fr",
  };
  let layout2 = {areas: "'top''bottom'", columns: "1fr", rows: "1fr 60px"};
  let layout3 = {areas: "'full'", columns: "1fr", rows: "1fr "};

  let actions = [];

  let isOpen = false;
  let runningProcess: Process = window.stateMachines.current();

  window.eventBroker.getTopic("omo", "shell").observable.subscribe((event: OmoEvent) =>
  {
    console.log("received:", event)
    runningProcess = window.stateMachines.current();
    if (event.type === "openMenu")
    {
      isOpen = true;
    }
    if (event.type == "runProcess")
    {
      runningProcess = window.stateMachines.run((<RunProcess>event).definition);
      isOpen = true;
    }
  });

  function routeLoading(e)
  {
    if (!e.detail.userData)
      return;

    actions = e.detail.userData.actions;
  }


  let quickActions: any[] = [];
  let overflowActions: any[] = [];

  $: {
    let _quickActions = actions.filter(o => o.pos && o.pos !== "overflow");
    quickActions = [0, 1, 2, 3].map(index =>
    {
      let actionAt: any = _quickActions.find(action => action.pos == index + 1);
      actionAt = actionAt ?? {
        type: "trigger",
        pos: (index + 1).toString(),
        icon: "",
        label: ""
      }
      return actionAt;
    });

    overflowActions = actions.filter(o => !o.pos || o.pos === "overflow");
    console.log(overflowActions)
  }

  function toggleOpen()
  {
    isOpen = !isOpen
    console.log("toggleOpen")
  }
</script>

<style>
  .app {
    height: 100%;
    overflow: hidden !important;
    position: relative;
  }
</style>

<Tailwind />

<div class="font-primary app">
  <Composite layout={layout2}>
    <Leaf area="top">
      <Router {routes} on:routeLoading={routeLoading}/>
    </Leaf>
    <Leaf area="bottom">
      <ActionBar on:actionButtonClick={toggleOpen} {quickActions}/>
      <Modal bind:isOpen={isOpen}>
        {#if runningProcess}
          <Process process={runningProcess} />
        {:else}
          {#each overflowActions as action}
            <div class="w-full">
              <div class="space-y-2">
                <div on:click={() => window.dispatchShellEvent(action.event())}>
                  <Button text="{action.label}" type="secondary" />
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </Modal>
    </Leaf>
  </Composite>
</div>
