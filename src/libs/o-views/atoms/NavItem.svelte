<script lang="ts">
  import Icon from 'fa-svelte'

  export let icon;
  export let text;
</script>

<style>
  div :global(.red) {
    color: red;
  }
  div :global(.sizeFifty) {
    font-size: 50px;
  }
</style>

<div
  class="flex items-center justify-center w-16 px-2 text-xs text-center hover:text-secondary-lighter">
  <span>
    {#if icon}
    <Icon icon={icon}></Icon>
    {/if}
    <p class="lowercase font-title">{text}</p></span>
</div>
