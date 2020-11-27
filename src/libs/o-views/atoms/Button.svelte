<script lang="ts">
  interface Button {
    data: {
      label: string;
    };
    design: {
      type: string;
      disabled?: boolean;
    };
  }
  export let mapping: Button;
</script>

<style>
  .button {
    @apply w-full p-3 font-bold text-center lowercase border-2 rounded-lg;
  }
</style>

{#if mapping.design.disabled}
  <div class="button bg-light-100 border-light-300 text-light-300">
    {mapping.data.label}
  </div>
{:else if mapping.design.type == 'primary'}
  <div
    class="text-white cursor-pointer button border-secondary bg-secondary hover:border-secondary-lighter hover:bg-secondary-lighter">
    {mapping.data.label}
  </div>
{:else if mapping.design.type == 'secondary'}
  <div
    class="bg-white cursor-pointer button border-secondary text-secondary hover:border-secondary-lighter hover:text-white hover:bg-secondary-lighter">
    {mapping.data.label}
  </div>
{:else if mapping.design.type == 'danger'}
  <div
    class="bg-white cursor-pointer button border-danger text-danger hover:bg-danger hover:text-white">
    {mapping.data.label}
  </div>
{:else if mapping.design.type == 'light'}
  <div
    class="bg-white cursor-pointer button border-light-400 text-light-400 hover:border-secondary-lighter hover:text-secondary-lighter">
    {mapping.data.label}
  </div>
{:else if mapping.design.type == 'light-danger'}
  <div
    class="bg-white cursor-pointer button border-light-400 text-light-400 hover:border-danger hover:text-danger">
    {mapping.data.label}
  </div>
{:else if mapping.design.type == 'light-danger'}
  <div
    class="bg-white cursor-pointer button border-danger text-danger hover:text-white hover:bg-danger">
    {mapping.data.label}
  </div>
{/if}
