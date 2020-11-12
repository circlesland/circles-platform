<script lang="ts">
  import MobileLayout from "src/libs/o-views/templates/MobileLayout.svelte";
  import TemplatetNavBottom from "src/libs/o-views/templates/TemplatetNavBottom.svelte";

  import Menu from "src/libs/o-views/molecules/Menu.svelte";
  import Actions from "src/dapps/wallet/menus/Actions.svelte";
  import Trusts from "src/dapps/wallet/components/Trusts.svelte";

  export let params = {};

  let address: string = null;

  $: {
    if (params.address) {
      address = params.address;
    }
  }
</script>

<style>
  .grid {
    display: grid;
    grid-template-rows: 40px 1fr auto;
  }
</style>

<MobileLayout>
  <TemplatetNavBottom>
    <div slot="content" class="grid overflow-hidden">
      <header
        class="px-3 py-2 font-bold bg-white border-b border-gray-300 text-primary">
        Trusted friends
      </header>
      <div class="overflow-x-hidden overflow-y-scroll bg-gray-100">
        <Trusts {address} />
      </div>
    </div>
    <div slot="nav">
      <Menu {address} actions={Actions} />
    </div>
  </TemplatetNavBottom>
</MobileLayout>
