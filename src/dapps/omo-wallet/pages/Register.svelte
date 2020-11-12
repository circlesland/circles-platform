<script lang="ts">
  import MobileLayout from "src/templates/MobileLayout.svelte";
  import QrCode from "svelte-qrcode";

  let waitingForFunding: Boolean = true;
</script>

<style>
  .grid {
    display: grid;
    grid-template-rows: 1fr auto;
  }
</style>

<MobileLayout>
  <div class="grid h-full">
    <main class="h-full p-8 overflow-y-scroll text-center bg-gray-100">
      <h1 class="text-3xl text-center font-title text-primary">Register New</h1>
      <p class="py-4 text-sm text-center text-gray-700">
        You need to be invited by someone or transfer xDAI to your account
      </p>
    </main>

    <footer class="p-4 border-t border-light-300">
      <div class="flex items-center justify-center">
        <QrCode
          value="http://universal-oval-wizard.fission.app/wallet/invite" />
      </div>
      <div class="w-full p-10 text-center">
        Send xDAI to this Address<br />
        <span>0x1287023498nh3d8ASIU567asd98FA98as</span>
      </div>

      <div class="flex space-x-4">
        <a
          href="#/dapps"
          class="px-4 py-2 uppercase border rounded border-light-300 text-primary">Back</a>
        {#if waitingForFunding}
          <div
            class="w-full py-2 text-center uppercase border rounded text-light-300 bg-light-100">
            Waiting for funding
          </div>
        {:else}
          <div
            class="w-full py-2 text-center uppercase border rounded text-light-300 border-light-300 bg-primary">
            Register Now
          </div>
        {/if}
      </div>
    </footer>
  </div>
</MobileLayout>
