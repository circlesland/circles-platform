<script lang="ts">
  import { push } from "svelte-spa-router";
</script>

<header class="text-primary font-primary">
  <div
    class="container flex flex-col flex-wrap items-center p-5 mx-auto md:flex-row">
    <a
      href="/"
      class="flex items-center mb-4 font-medium title-font text-primary md:mb-0">
      <img src="logos/logo_alpha.svg" alt="OMO" class="h-12" />
    </a>
    <nav
      class="flex flex-wrap items-center justify-center text-base md:ml-auto">
      <a
        href="https://discord.gg/CS6xq7jECR"
        class="px-4 py-1 mr-5 lowercase bg-white border hover:bg-secondary-lighter hover:text-white border-light-200 rounded-xl">
        Chat</a>
      <a
        href="https://github.com/omoearth/omo-li/discussions"
        class="px-4 py-1 mr-5 lowercase bg-white border hover:bg-secondary-lighter hover:text-white border-light-200 rounded-xl">Forum</a>
      <a
        href="#/lightpaper"
        class="px-4 py-1 mr-5 lowercase bg-white border hover:bg-secondary-lighter hover:text-white border-light-200 rounded-xl">Lightpaper</a>
    </nav>
    <button
      on:click={() => push('#/omoli/dapps')}
      class="inline-flex items-center px-4 py-1 mt-4 text-base font-bold text-white lowercase border-0 bg-secondary-lighter rounded-xl focus:outline-none hover:bg-white hover:text-secondary-lighter hover:border hover:border-light-300 md:mt-0">Login
      <svg
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        class="w-4 h-4 ml-1"
        viewBox="0 0 24 24">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</header>
