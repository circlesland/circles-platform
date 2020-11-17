<script lang="ts">
  import Button from "src/libs/o-views/atoms/Button.svelte";

  import { _ } from "svelte-i18n";

  export let address: string;
</script>

{#if !address}
  <div
    class="flex w-full h-full p-3 space-x-3 bg-white border-t border-gray-300">
    <!-- <a
      href="#/wallet/register"
      class="w-full px-4 py-2 text-center uppercase border rounded cursor-pointer text-primary bg-light-100">
      {$_('omo_button_register')}
    </a> -->
    <a href="#/wallet/connect" class="w-full">
      <Button type="primary" text="Login" />
    </a>
  </div>
{:else}
  <div class="flex items-center justify-center h-full text-gray-500">
    -- quick actions placeholder --
  </div>

  <!--<div
    class="flex justify-between px-10 pt-3 pb-2 text-gray-400 bg-white border-t border-gray-300">
    <div
      class="flex items-center justify-center w-24 text-xs text-center hover:text-primary">
      <a href="#/wallet/{address}/trusts">
        <i class="text-2xl fas fa-heart" />
        <p>{$_('omo_nav_trust_friend')}</p>
      </a>
    </div>
    <div
      class="flex items-center justify-center w-24 text-xs text-center hover:text-primary">
      <a href="#/wallet/{address}/trusts">
        <i class="text-2xl fas fa-user-plus" />
        <p>{$_('omo_nav_invite_friend')}</p>
      </a>
    </div>
    <div
      class="flex items-center justify-center w-24 text-xs text-center hover:text-primary">
      <a href="#/wallet/{address}/safe">
        <i class="text-2xl fas fa-money-bill-wave" />
        <p>{$_('omo_nav_send_money')}</p>
      </a>
    </div>
  </div> -->
{/if}
