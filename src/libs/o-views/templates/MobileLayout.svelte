<style>
  .note {
    display: grid;
    grid-template-rows: auto 1fr;
  }
</style>

<div
  class="flex flex-col items-center justify-center h-full bg-white bg-center bg-cover">
  <div
    class="justify-center w-full h-full max-w-lg overflow-hidden bg-white wrap">
    <div class="h-full overflow-hidden border note">
      <div class="p-2 text-xs text-white bg-pink-800">
        This dapp is an early alpha test version. For wishes and feedback join
        our
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
