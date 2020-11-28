<script lang="ts">
  interface CategoryTitle {
    data: {
      label: string;
    };
  }
  export let mapping: CategoryTitle;
</script>

<div
  class="px-3 py-1 mt-4 mb-2 text-sm font-bold lowercase border border-blue-100 rounded-lg bg-blue-50 text-secondary font-title">
  {mapping.data.label}
</div>
