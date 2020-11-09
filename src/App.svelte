<script lang="ts">
  import Router from "svelte-spa-router";
  import routes from "./routes";
  import Tailwind from "./Tailwind.svelte";
</script>

<Tailwind />

<div class="h-full font-sans">
  <Router {routes} />
</div>
