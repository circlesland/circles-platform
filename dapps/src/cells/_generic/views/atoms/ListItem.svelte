<script lang="ts">
  import IpfsImage from "../../../../libs/o-views/atoms/IpfsImage.svelte";
  import ButtonIcon from "../../../../libs/o-views/atoms/ButtonIcon.svelte";
  import {QuickAction} from "omo-kernel-interfaces/dist/quickAction";

  export let isExpanded: boolean = false;
  export let height: "1" | "2" | "auto" = "2";
  export let fullWith: boolean = true;

  export let imageCid: string | undefined;
  export let imageMimeType: string | undefined;

  export let title: string;
  export let description: string | undefined;
  export let rightText: string | undefined;

  export let actions: QuickAction[] | undefined;

  function toggleExpand() {
    isExpanded = !isExpanded;
  }
</script>

<style>
  .listItem {
    display: grid;
    grid-template-columns: 3.5rem 1fr 1fr;
    grid-template-rows: 3.5rem;
    max-width: 100%;
  }
</style>

<div
  on:click={toggleExpand}
  class="w-full bg-white border rounded-xl listItem border-light-200">
  {#if imageCid}
    <div class="flex items-center justify-center p-2 rounded-lg">
      <IpfsImage cid={imageCid} mimeType={imageMimeType} classes="rounded-lg"/>
    </div>
  {/if}
  <div class="flex items-center">
    <div class="px-1 py-2">
      <div class="text-xs md:text-base text-primary">
        {title}
      </div>
      {#if height !== "1" && description}
        <p class="text-gray-500 text-xxs md:text-xs">
          <span class="text-gray-500">
            {description}
          </span>
        </p>
      {/if}
    </div>
  </div>
  <div class="flex justify-end p-2 space-x-2 overflow-hidden text-right">
    {#if rightText}
      <div class="text-3xl font-light text-action">
        <span style="white-space:nowrap; display: inline-block">
          {rightText}
        </span>
      </div>
    {/if}
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
{#if isExpanded}
  <div class="px-3">
    <div
      class="w-full p-2 text-gray-500 bg-white border-b border-l border-r rounded-b-xl text-xxs md:text-xs border-light-200">
      <slot/>
    </div>
  </div>
{/if}