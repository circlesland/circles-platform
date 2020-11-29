<script lang="ts">
  export let data:{text:string};
</script>
{#if data && data.text}
<div class="text-center p-10 text-primary">{data.text}</div>
{/if}
