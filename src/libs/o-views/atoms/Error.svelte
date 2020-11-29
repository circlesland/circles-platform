<script lang="ts">
  export let data: { text: string };
</script>

{#if data && data.text}
  <h1 class="p-8 py-16 text-xl text-center text-white rounded-xl bg-danger">
    {data.text}
  </h1>
{/if}
