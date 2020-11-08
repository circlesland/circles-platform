<script>
  export let isOpen;
  export let actions;
</script>
<div>
  {#if isOpen}
  <svelte:component this={actions}></svelte:component>
  {/if}
  <footer
    class="flex justify-between px-4 pt-3 pb-2 text-gray-400 bg-white border-t border-gray-300">
    <div
      class="flex items-center justify-center px-4 text-xs text-center text-primary">
      <a href="#/wallet/tokens">
        <i class="text-2xl fas fa-coins" />
        <p>Tokens</p>
      </a>
    </div>
    <div
      class="flex items-center justify-center px-4 text-xs text-center text-primary">
      <a href="#/wallet/trusts">
        <i class="text-2xl fas fa-exchange-alt" />
        <p>Trust</p>
      </a>
    </div>
    <div class="flex items-center justify-center px-4 text-xs text-center" on:click={() => isOpen = !isOpen}>
      <div>
        <i class="text-2xl fas fa-plus" />
        <p>actions</p>
      </div>
    </div>
    <div
      class="flex items-center justify-center px-4 text-xs text-center text-primary">
      <a href="#/wallet/safe">
        <i class="text-2xl fas fa-piggy-bank" />
        <p>Safe</p>
      </a>
    </div>
    <div
      class="flex items-center justify-center px-4 text-xs text-center text-primary">
      <a href="#/dapps">
        <i class="text-2xl fas fa-user-circle" />
        <p>Home</p>
      </a>
    </div>
  </footer>
</div>
