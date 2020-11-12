<style>
  .note {
    display: grid;
    grid-template-rows: auto 1fr;
  }
</style>

<div
  class="flex flex-col items-center justify-center h-full bg-white bg-center bg-cover"
  style="background-image: url(/images/background.webp)">
  <div
    class="justify-center w-full h-full max-w-lg overflow-hidden bg-white wrap">
    <div class="h-full overflow-hidden note">
      <div class="p-2 text-xs text-white bg-pink-800">
        <span class="uppercase">Please note:</span>
        this is an early alpha test version. For wishes and fedback join our
        <a
          href="https://discord.gg/Rbhy4j9"
          class="px-2 py-1 text-white rounded bg-primary">chat</a>
      </div>
      <slot>
        <p>Dapp Screen</p>
      </slot>
    </div>
  </div>
</div>
