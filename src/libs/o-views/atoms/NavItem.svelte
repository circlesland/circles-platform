<script lang="ts">
  export let icon;
  export let text;
</script>

<div
  class="flex items-center justify-center w-16 px-2 text-xs text-center hover:text-secondary-lighter">
  <span>
    {#if icon}<i class="text-2xl fas fa-{icon}" />{/if}
    <p class="lowercase font-title">{text}</p></span>
</div>
