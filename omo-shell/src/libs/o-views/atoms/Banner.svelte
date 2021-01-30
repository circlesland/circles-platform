<script lang="ts">
  export let data: { text: string };
</script>

{#if data && data.text}
  <div class="p-10 text-center text-primary">{data.text}</div>
{/if}
