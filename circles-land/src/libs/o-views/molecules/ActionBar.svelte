<script lang="ts">
  import NavItem from "../atoms/NavItem.svelte";
  import { location } from "svelte-spa-router";
  import { createEventDispatcher } from "svelte";
  import Compose from "../atoms/Compose.svelte";
  import Icon from "fa-svelte";

  import { faPlus } from "@fortawesome/free-solid-svg-icons";
  import { QuickAction } from "omo-kernel-interfaces/dist/quickAction";

  const dispatch = createEventDispatcher();
  export let quickActions: QuickAction[] = [];

  function onActionButtonClick() {
    dispatch("actionButtonClick");
  }

  function isActive(action: QuickAction) {
    if (!action || !action.route) return;

    return action.route.indexOf($location) > -1;
  }
</script>

<Compose
  rows="1fr"
  columns="1fr"
  tw="bg-white border-t border-light-200 text-light-400 h-20 w-full mt-0.5 md:border md:border-light-200 md:rounded-t-xl"
>
  <Compose rows="1fr" columns="1fr" tw="w-full max-w-4xl mx-auto">
    <Compose columns="1fr" rows="1fr" tw="w-full">
      <Compose
        rows="1fr"
        columns="1fr 1fr 80px 1fr 1fr"
        tw="w-full px-2 md:px-0 flex items-center"
      >
        <a
          href={quickActions[0].route}
          class:active={isActive(quickActions[0])}
          class="mx-auto"
        >
          <NavItem mapping={quickActions[0].mapping} />
        </a>

        <a
          href={quickActions[1].route}
          class:active={isActive(quickActions[1])}
          class="mx-auto"
        >
          <NavItem mapping={quickActions[1].mapping} />
        </a>

        <button
          on:click={onActionButtonClick}
          class="w-16 h-16 mx-auto text-white border-blue-300 rounded-full bg-light-100 hover:bg-light-200"
        >
          <div class="flex items-center justify-center">
            <img src="logos/circles.svg" alt="+" class="p-2" />
          </div>
        </button>

        <a
          href={quickActions[2].route}
          class:active={isActive(quickActions[2])}
          class="mx-auto"
        >
          <NavItem mapping={quickActions[2].mapping} />
        </a>

        <a
          href={quickActions[3].route}
          class:active={isActive(quickActions[3])}
          class="mx-auto"
        >
          <NavItem mapping={quickActions[3].mapping} />
        </a>
      </Compose>
    </Compose>
  </Compose>
</Compose>

<style global>
  :global(a.active) {
    color: #0d49a3;
  }
</style>
