<script lang="ts">
  import NavItem from "../atoms/NavItem.svelte";
  import { location, push } from "svelte-spa-router";
  import { createEventDispatcher } from "svelte";
  import { ActionBarAction } from "../../../routes";
  import Button from "../atoms/Button.svelte";
  import Compose from "../atoms/Compose.svelte";

  export let safeAddress: string;

  const dispatch = createEventDispatcher();
  export let quickActions: ActionBarAction[] = [];

  function onActionButtonClick() {
    dispatch("actionButtonClick");
  }

  function isActive(action: ActionBarAction) {
    if (!action || !action.route) return;

    return action.route.indexOf($location) > -1;
  }
  function logout() {
    localStorage.removeItem("omo.address");
    localStorage.removeItem("omo.safeAddress");
    localStorage.removeItem("omo.privateKey");
    push("/");
  }
</script>

<style global>
  :global(a.active) {
    color: #0d49a3;
  }
</style>

{#if safeAddress && $location == '/omo/dapps'}
  <Compose
    tw="justify-center items-center p-4 bg-white  border-t border-light-300"
    columns="1fr"
    rows="1fr">
    <a on:click={logout} class="w-full">
      <Button text="Logout" type="danger" />
    </a>
  </Compose>
{:else if safeAddress}
  <Compose
    rows="1fr"
    columns="1fr 1fr 80px 1fr 1fr"
    tw="bg-white border-t border-light-300 text-light-400 h-20 justify-center items-center px-4">
    <Compose rows="1fr" columns="1fr">
      <a
        href={quickActions[0].route}
        class:active={isActive(quickActions[0])}
        class="mx-auto">
        <NavItem icon={quickActions[0].icon} text={quickActions[0].label} />
      </a>
    </Compose>
    <Compose rows="1fr" columns="1fr">
      <a
        href={quickActions[1].route}
        class:active={isActive(quickActions[1])}
        class="mx-auto">
        <NavItem icon={quickActions[1].icon} text={quickActions[1].label} />
      </a>
    </Compose>
    <Compose rows="1fr" columns="1fr">
      <div
        on:click={onActionButtonClick}
        class="w-16 h-16 mx-auto mb-3 text-white rounded-full action bg-secondary hover:bg-secondary-lighter">
        <div class="flex items-center justify-center">
          <i class="mt-4 text-3xl fas fa-plus " />
        </div>
      </div>
    </Compose>
    <Compose rows="1fr" columns="1fr">
      <a
        href={quickActions[2].route}
        class:active={isActive(quickActions[2])}
        class="mx-auto">
        <NavItem icon={quickActions[2].icon} text={quickActions[2].label} />
      </a>
    </Compose>
    <Compose rows="1fr" columns="1fr">
      <a
        href={quickActions[3].route}
        class:active={isActive(quickActions[3])}
        class="mx-auto">
        <NavItem icon={quickActions[3].icon} text={quickActions[3].label} />
      </a>
    </Compose>
  </Compose>
{:else if $location == '/'}
  <Compose
    tw="justify-center items-center p-4 bg-white  border-t border-light-300"
    columns="1fr"
    rows="1fr">
    <a href="#/omo/dapps" class="w-full p-2">
      <Button text="Go to app" type="primary" />
    </a>
  </Compose>
{:else}
  <Compose
    tw="justify-center items-center p-4 bg-white  border-t border-light-300"
    columns="1fr"
    rows="1fr">
    <a on:click={onActionButtonClick} class="w-full p-2">
      <Button text="Login" type="primary" />
    </a>
  </Compose>
{/if}
