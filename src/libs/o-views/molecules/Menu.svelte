<script lang="ts">
  import Modal from "src/libs/o-views/molecules/Modal.svelte";
  import { link } from "svelte-spa-router";
  import active from "svelte-spa-router/active";

  let triggerRef;
  export let isOpen: Boolean;
  export let actions;

  export let address: string = null;
</script>

<style>
  :global(a.active) {
    color: #0c266a;
  }
  /* .action {
    z-index: 1000;
  } */
</style>

<Modal {triggerRef} bind:isOpen>
  <svelte:component this={actions} />
</Modal>

<button
  class="absolute flex items-center justify-center w-full text-xs text-center action"
  on:click={() => (isOpen = !isOpen)}>
  {#if !isOpen}
    <div
      class="fixed w-16 h-16 mx-auto mt-4 text-white rounded-full action bg-secondary hover:bg-primary">
      <i class="mt-4 text-3xl fas fa-plus " />
    </div>
  {/if}
</button>

<footer
  class="flex justify-between px-4 pt-3 pb-2 text-gray-400 bg-white border-t border-gray-300">
  <div
    class="flex items-center justify-center w-16 px-2 text-xs text-center hover:text-primary">
    <a href="#/wallet/{address}/safe" use:active={{ path: '/wallet/*/safe' }}>
      <i class="text-2xl fas fa-piggy-bank" />
      <p>Safe</p>
    </a>
  </div>
  <div
    class="flex items-center justify-center w-16 px-2 text-xs text-center hover:text-primary">
    <a
      href="#/wallet/{address}/tokens"
      use:active={{ path: '/wallet/*/tokens' }}>
      <i class="text-2xl fas fa-coins" />
      <p>Tokens</p>
    </a>
  </div>
  <div
    class="flex items-center justify-center w-16 px-2 text-xs text-center hover:text-primary" />
  <div
    class="flex items-center justify-center w-16 px-2 text-xs text-center hover:text-primary">
    <a
      href="/wallet/{address}/trusts"
      use:link
      use:active={{ path: '/wallet/*/trusts' }}>
      <i class="text-2xl fas fa-user-friends" />
      <p>Friends</p>
    </a>
  </div>

  <div
    class="flex items-center justify-center w-16 px-2 text-xs text-center hover:text-primary">
    <a href="/omo/dapps" use:link>
      <i class="text-2xl fas fa-user-circle" />
      <p>Home</p>
    </a>
  </div>
</footer>
