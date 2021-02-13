<script lang="ts">
  import { ProfileField } from "../interfaces/molecules";

  export let mapping: ProfileField;
</script>

<style>
  .card {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 3.5rem;
    max-width: 100%;
  }
</style>

<div class="w-full bg-white border rounded-xl card border-light-200">
  <div class="px-4 py-2">
    <div class="text-base text-primary">{mapping.data.title}</div>
    <p class="text-xs text-gray-500">
      <span class="text-gray-400">{mapping.data.subtitle}</span>
    </p>
  </div>
</div>
