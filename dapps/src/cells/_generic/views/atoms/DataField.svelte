<script lang="ts">
  import {DataFieldMapping} from "../../../../libs/o-views/interfaces/molecules";
  import ButtonIcon from "../../../../libs/o-views/atoms/ButtonIcon.svelte";

  export let mapping: DataFieldMapping;
  export let actions: {
    icon: any,
    title: string,
    action: any
  }[] | undefined = [];
</script>

<style>
  .card {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 3.5rem;
    max-width: 100%;
  }
</style>

<div>
  <div class="w-full bg-white border rounded-xl card border-light-200">
    <div class="flex items-center">
      <div class="px-4 py-2">
        <div class="text-base text-primary">{mapping.data.title}</div>
        <p class="text-xs text-gray-500">
          <span class="text-gray-400">{mapping.data.subtitle}</span>
        </p>
      </div>
    </div>
    <div class="flex justify-end p-2 space-x-2 overflow-hidden text-right">
      {#if actions}
        {#each actions as action}
          <div
            on:click={async (e) => {
            await action.action();
            e.preventDefault();
            e.stopPropagation();
          }}>
            <ButtonIcon mapping={{
            design: {
              icon: action.icon,
              type: "primary",
              disabled: false
            },
            tooltip: action.title
          }}/>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>