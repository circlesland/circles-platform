<script lang="ts">
  import NavItem from "../atoms/NavItem.svelte";
  import { location, push } from "svelte-spa-router";
  import { createEventDispatcher } from "svelte";
  import { ActionBarAction } from "../../../routes";
  import Button from "../atoms/Button.svelte";

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
  <div on:click={logout} class="w-full p-2">
    <Button text="Logout" type="danger" />
  </div>
{:else if safeAddress}
  <button
    class="absolute flex items-center justify-center w-full text-center action"
    on:click={onActionButtonClick}>
    <div
      class="fixed w-16 h-16 mx-auto mt-4 text-white border rounded-full border-light-100 action bg-secondary hover:bg-secondary-lighter">
      <i class="mt-4 text-3xl fas fa-plus " />
    </div>
  </button>

  <footer
    class="flex justify-between px-4 pt-3 pb-2 text-gray-400 bg-white border-t border-gray-300">
    <a href={quickActions[0].route} class:active={isActive(quickActions[0])}>
      <NavItem icon={quickActions[0].icon} text={quickActions[0].label} />
    </a>

    <a href={quickActions[1].route} class:active={isActive(quickActions[1])}>
      <NavItem icon={quickActions[1].icon} text={quickActions[1].label} />
    </a>

    <a on:click={() => {}}>
      <div
        class="flex items-center justify-center w-16 px-2 text-center stext-xs hover:text-secondary-lighter">
        <span>
          <i class="text-2xl" />
          <p class="lowercase font-title" />
        </span>
      </div>
    </a>

    <a href={quickActions[2].route} class:active={isActive(quickActions[2])}>
      <NavItem icon={quickActions[2].icon} text={quickActions[2].label} />
    </a>

    <a href={quickActions[3].route} class:active={isActive(quickActions[3])}>
      <NavItem icon={quickActions[3].icon} text={quickActions[3].label} />
    </a>
  </footer>
{:else if $location == '/'}
  <a href="#/omo/dapps" class="w-full p-2">
    <Button text="Go to app" type="primary" />
  </a>
{:else}
  <div on:click={onActionButtonClick} class="w-full p-2">
    <Button text="Login" type="primary" />
  </div>
{/if}
