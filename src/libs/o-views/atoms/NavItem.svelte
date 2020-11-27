<script lang="ts">
  import Icon from "fa-svelte";

  interface NavItem {
    data: {
      label: string;
    };
    design: {
      icon: any;
    };
  }

  export let mapping: NavItem;
</script>

<div
  class="flex items-center justify-center w-16 px-2 text-xs text-center hover:text-secondary-lighter">
  <span>
    {#if mapping.design.icon}
      <Icon icon={mapping.design.icon} class="text-2xl" />
    {/if}
    <p class="lowercase font-title">{mapping.data.label}</p></span>
</div>
