<script lang="ts">
  import Modal from "./Modal.svelte";

  let triggerRef;
  export let isOpen;
  export let actions;

  export let address: string = null;
</script>

<style>
  .action {
    z-index: 1001;
  }
</style>

<Modal {triggerRef} bind:isOpen>
  <svelte:component this={actions} />
</Modal>
<footer
  class="flex justify-between px-4 pt-3 pb-2 text-gray-400 bg-white border-t border-gray-300">
  <div
    class="flex items-center justify-center w-16 px-2 text-xs text-center text-primary">
    <a href="#/wallet/{address}/safe">
      <i class="text-2xl fas fa-piggy-bank" />
      <p>Safe</p>
    </a>
  </div>
  <div
    class="flex items-center justify-center w-16 px-2 text-xs text-center text-primary">
    <a href="#/wallet/{address}/tokens">
      <i class="text-2xl fas fa-coins" />
      <p>Tokens</p>
    </a>
  </div>
  <div
    class="flex items-center justify-center text-xs text-center action"
    on:click={() => (isOpen = !isOpen)}>
    <div
      class="relative w-16 h-16 -mt-5 text-white rounded-full {isOpen ? 'bg-primary' : 'bg-action'}">
      <!-- <img src="images/logo_white.png" /> -->
      <i class="mt-4 text-3xl fas fa-plus" />
    </div>
  </div>
  <div
    class="flex items-center justify-center w-16 px-2 text-xs text-center text-primary">
    <a href="#/wallet/{address}/trusts">
      <i class="text-2xl fas fa-user-friends" />
      <p>Friends</p>
    </a>
  </div>

  <div
    class="flex items-center justify-center w-16 px-2 text-xs text-center text-primary">
    <a href="#/dapps">
      <i class="text-2xl fas fa-user-circle" />
      <p>Home</p>
    </a>
  </div>
</footer>
