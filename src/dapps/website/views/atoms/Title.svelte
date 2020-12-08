<script lang="ts">
  interface Title {
    data: {
      title: string;
    };
  }
  export let mapping: Title;
</script>

<div class="mt-4 text-2xl font-bold text-primary">{mapping.data.title}</div>
