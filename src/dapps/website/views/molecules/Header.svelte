<script lang="ts">
  import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
  import { push } from "svelte-spa-router";
  import Icon from "fa-svelte";
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
        class="px-3 py-1 mr-2 font-bold lowercase bg-white border md:mr-5 hover:bg-secondary-lighter hover:text-white border-light-200 rounded-xl">
        Chat</a>
      <a
        href="https://github.com/omoearth/omo-li/discussions"
        class="px-3 py-1 mr-2 font-bold lowercase bg-white border md:mr-5 hover:bg-secondary-lighter hover:text-white border-light-200 rounded-xl">Forum</a>
      <a
        href="#/whitepaper"
        class="px-3 py-1 mr-2 font-bold lowercase bg-white border md:mr-5 hover:bg-secondary-lighter hover:text-white border-light-200 rounded-xl">Lightpaper</a>
    </nav>
    <button
      on:click={() => push('#/omoli/dapps')}
      class="inline-flex items-center px-4 py-1 mt-4 text-base font-bold text-white lowercase border-0 bg-secondary rounded-xl focus:outline-none hover:bg-white hover:text-secondary hover:border hover:border-light-300 md:mt-0">Login
      <span class="mb-1 ml-2"><Icon icon={faUserCircle} />
      </span></button>
  </div>
</header>
