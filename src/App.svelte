<script lang="ts">
  import Router from "svelte-spa-router";
  import routes from "src/routes";
  import Tailwind from "src/Tailwind.svelte";
</script>

<Tailwind />

<div class="h-full font-sans">
  <Router {routes} />
</div>
