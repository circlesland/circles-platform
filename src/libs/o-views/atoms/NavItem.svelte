<script lang="ts">
  import Icon from "fa-svelte";
  import { NavItem } from "./../interfaces/atoms";

  export let mapping: NavItem;
</script>

<div
  class="flex items-center justify-center w-16 px-2 text-center hover:text-secondary-lighter">
  <span>
    {#if mapping.design.icon}
      <Icon icon={mapping.design.icon} class="text-2xl" />
    {/if}
    <p class="lowercase text-xxs lg:text-xs font-title">
      {mapping.data.label}
    </p></span>
</div>
