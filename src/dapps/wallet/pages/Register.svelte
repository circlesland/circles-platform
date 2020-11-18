<script lang="ts">
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import TemplateHeaderMainActionFooter from "src/libs/o-views/templates/TemplateHeaderMainActionFooter.svelte";

  import QrCode from "svelte-qrcode";


  let waitingForFunding: Boolean = true;
  let header = {
    title: "Register",
  };
</script>

<TemplateHeaderMainActionFooter>
  <header slot="header">
    <Header data={header} />
  </header>
  <main
    slot="main"
    class="h-full p-8 overflow-y-scroll text-center bg-gray-100">
    <h1 class="text-3xl text-center font-title text-primary">Register New</h1>
    <p class="py-4 text-sm text-center text-gray-700">
      You need to be invited by someone or transfer xDAI to your account
    </p>
  </main>
  <div slot="action">
    <div class="flex items-center justify-center">
      <QrCode value="http://universal-oval-wizard.fission.app/wallet/invite" />
    </div>
    <div class="w-full p-10 text-center">
      (Don't) Send xDAI to this Address<br />
      <span>0x123456789 (alpha test - not working yet)</span>
    </div>
  </div>
  <footer slot="footer" class="p-4 border-t border-light-300">
    <div class="flex space-x-4">
      <a
        href="#/omo/dapps"
        class="px-4 py-2 uppercase border border-gray-300 rounded text-primary"><i
          class="fas fa-arrow-left" /></a>
      <div
        class="w-full px-4 py-2 text-center text-white uppercase border rounded border-light-300 bg-primary">
        Copy Invite Link
      </div>
      {#if waitingForFunding}
        <div
          class="w-full py-2 text-center uppercase border rounded text-light-300 bg-light-100">
          Register
        </div>
      {:else}
        <div
          class="w-full py-2 text-center text-white uppercase border rounded border-light-300 bg-primary">
          Register Now
        </div>
      {/if}
    </div>
  </footer>
</TemplateHeaderMainActionFooter>
