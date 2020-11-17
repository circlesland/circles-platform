<script lang="ts">
  import Modal from "src/libs/o-views/molecules/Modal.svelte";
  import { link } from "svelte-spa-router";
  import active from "svelte-spa-router/active";
  import NavItem from "../atoms/NavItem.svelte";

  let triggerRef;

  export let isOpen: Boolean;
  export let actions;

  export let address: string = null;

  window.eventBroker.getTopic("omo", "shell").observable.subscribe((event) => {
    if (event === "openMenu") {
      isOpen = true;
    }
  });
</script>

<style>
  :global(a.active) {
    color: #0c266a;
  }
</style>

<Modal {triggerRef} bind:isOpen>
  <svelte:component this={actions} />
</Modal>

<button
  class="absolute flex items-center justify-center w-full text-center action"
  on:click={() => (isOpen = !isOpen)}>
  {#if !isOpen}
    <div
      class="fixed w-16 h-16 mx-auto mt-6 text-white border rounded-full border-light-100 action bg-secondary hover:bg-primary">
      <i class="mt-4 text-3xl fas fa-plus " />
    </div>
  {/if}
</button>

<footer
  class="flex justify-between px-4 pt-3 pb-2 text-gray-400 bg-white border-t border-gray-300">
  <a href="#/wallet/{address}/safe" use:active={{ path: '/wallet/*/safe' }}>
    <NavItem icon="piggy-bank" text="Safe" />
  </a>

  <a href="#/wallet/{address}/tokens" use:active={{ path: '/wallet/*/tokens' }}>
    <NavItem icon="coins" text="Token" />
  </a>

  <!-- placeholder for the action button -->
  <div class="w-12 px-2" />

  <a
    href="/wallet/{address}/trusts"
    use:link
    use:active={{ path: '/wallet/*/trusts' }}>
    <NavItem icon="user-friends" text="friends" />
  </a>
  <a href="/omo/dapps" use:link>
    <NavItem icon="user-circle" text="home" />
  </a>
</footer>
