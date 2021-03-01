<script lang="ts">
  import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
  import { push } from "svelte-spa-router";
  import Icon from "fa-svelte";
  import Login from "./Login.svelte";
</script>

<header class="text-primary font-primary">
  <div
    class="container flex flex-col flex-wrap items-center p-5 mx-auto md:flex-row"
  >
    <a
      href="/"
      class="flex items-center mb-4 font-medium title-font text-primary md:mb-0"
    >
      <img src="logos/circles.png" alt="Circles" class="h-12" />
    </a>
    <nav
      class="flex flex-wrap items-center justify-center text-base md:ml-auto"
    >
      <a
        href="https://discord.gg/CS6xq7jECR"
        class="px-3 uppercase font-title text-secondary hover:text-tertiary"
        >chat</a
      >
      <a
        href="https://github.com/omoearth/omo-li/discussions"
        class="px-3 uppercase font-title text-secondary hover:text-tertiary"
        >forum</a
      >
      <a
        href="#/visionpaper"
        class="px-3 uppercase font-title text-secondary hover:text-tertiary"
        >visionpaper</a
      >
    </nav>
    <Login size="lg" />
  </div>
</header>
