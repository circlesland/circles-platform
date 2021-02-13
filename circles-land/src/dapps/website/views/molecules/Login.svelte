<script lang="ts">
  import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

  import Icon from "fa-svelte";
  import { push } from "svelte-spa-router";

  export let title = "Login with CirclesID";
  export let size = "2xl";
</script>

<button
  on:click={() => push("#/omoli/dapps")}
  class="inline-flex text-{size} items-center px-2 py-1 mt-4 font-bold border border-light-200 rounded-full text-bold text-primary bg-white focus:outline-none hover:bg-light-100 hover:border hover:border-light-300 md:mt-0"
>
  <img src="logos/circles.png" alt="circles" class="w-6 h-6" />
  <span class="px-2">{title}</span>
</button>
