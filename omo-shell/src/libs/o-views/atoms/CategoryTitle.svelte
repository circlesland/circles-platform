<script lang="ts">
  import { CategoryTitle } from "./../interfaces/atoms";

  export let mapping: CategoryTitle;
</script>

<div
  class="px-3 py-1 text-sm font-bold lowercase border border-blue-100 rounded-xl bg-blue-50 text-secondary">
  {mapping.data.label}
</div>
