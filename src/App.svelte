<script lang="ts">
  import Router from "svelte-spa-router";
  import routes from "./routes";
  import Tailwind from "./Tailwind.svelte";
</script>

<Tailwind />

<ul class="flex">
  <li class="p-2 border-2 rounded text-primary font-title border-primary">
    <a href="#/">Home</a>
  </li>
  <li class="p-2 border-2 rounded text-primary font-title border-primary">
    <a href="#/dapps">dapps</a>
  </li>
  <li class="p-2 border-2 rounded text-primary font-title border-primary">
    <a href="#/does/not/exist">Not found</a>
  </li>
</ul>

<!-- Show the router -->
<Router {routes} />

<!-- <main class="h-full p-12 font-sans text-center text-white bg-primary">
  <h1 class="text-3xl font-title">Omo Li</h1>

  <div class="flex justify-center">
    <div
      class="p-2 m-2 border-2 border-white rounded"
      on:click={() => page("/app")}>
      App
    </div>
    <div
      class="p-2 m-2 border-2 border-white rounded"
      on:click={() => page("/about")}>
      About
    </div>
  </div>
  <div class="h-full overflow-y-scroll">
    <svelte:component this={currentComponent}></svelte:component>
  </div>
</main> -->
