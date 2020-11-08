<script lang="ts">
  import { send, state } from "./StateMachine";
  import page from "page";
  import AppPage from "./AppPage.svelte"
  import List from "./List.svelte"

  page.start({
    hashbang: true,
  });

  page("*", (ctx) => {
    console.log(ctx);
    send({ type: 'NAVIGATE', path: ctx.pathname, params: ctx.params });
  });

  let currentComponent = AppPage;

  $: {
    switch ($state.context.view) {
      case "AppPage": currentComponent = AppPage; break
      case "About": currentComponent = List; break
    }
  }
</script>

<style global>
  @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

  @tailwind base;
  @tailwind utilities;
  @tailwind components;

  html,
  body {
    height: 100%;
    overflow: hidden;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>

<main class="h-full p-12 font-sans text-center text-white bg-primary">
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
</main>
