<script lang="ts">
  export let address: string;
</script>

{#if !address}
  <div
    class="flex w-full h-full p-3 space-x-3 bg-white border-t border-gray-300">
    <a
      href="#/"
      class="px-4 py-2 uppercase border border-gray-300 rounded text-primary"><i
        class="fas fa-arrow-left" /></a>
    <a
      href="#/wallet/register"
      class="w-full px-4 py-2 text-center uppercase border rounded cursor-pointer text-primary bg-light-100">
      Register New
    </a>
    <a
      href="#/wallet/connect"
      class="w-full py-2 text-center text-white uppercase rounded cursor-pointer bg-primary">
      Login
    </a>
  </div>
{:else}
  <div
    class="flex justify-between px-10 pt-3 pb-2 text-gray-400 bg-white border-t border-gray-300">
    <div
      class="flex items-center justify-center w-20 px-2 text-xs text-center hover:text-primary">
      <a href="#/wallet/{address}/trusts">
        <i class="text-2xl fas fa-heart" />
        <p>Add Friend</p>
      </a>
    </div>
    <div
      class="flex items-center justify-center w-20 px-2 text-xs text-center hover:text-primary">
      <a href="#/wallet/{address}/trusts">
        <i class="text-2xl fas fa-user-plus" />
        <p>Invite Friend</p>
      </a>
    </div>
    <div
      class="flex items-center justify-center w-20 px-2 text-xs text-center hover:text-primary">
      <a href="#/wallet/{address}/safe">
        <i class="text-2xl fas fa-money-bill-wave" />
        <p>Send Payment</p>
      </a>
    </div>
  </div>
{/if}
