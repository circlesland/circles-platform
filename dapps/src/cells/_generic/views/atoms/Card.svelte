<script lang="ts">
  import IpfsImage from "../../../../libs/o-views/atoms/IpfsImage.svelte";
  import Icon from "fa-svelte";
  import {createEventDispatcher} from "svelte";
  import {QuickAction} from "omo-kernel-interfaces/dist/quickAction";

  export let pictureCid: String;
  export let pictureMimeType: String;

  export let avatarCid: String;
  export let avatarMimeType: String;
  export let avatarName: String;
  export let avatarStatus: String;

  export let badeText: String;
  export let statusBadgeText: String;
  export let statusBadgeColor: String = "bg-action";

  export let title:String = "";
  export let description:String = "";

  export let actions: QuickAction[] | undefined;

  const dispatch = createEventDispatcher();
</script>

<div
  class="flex flex-col overflow-hidden bg-white border hover:shadow-xl rounded-xl border-light-200">
  <div class="relative flex-shrink-0">
    {#if pictureCid}
      <IpfsImage cid={pictureCid} mimeType={pictureMimeType} classes="object-cover w-full h-72"/>
    {/if}
    {#if badeText}
        <span
          class="absolute top-0 right-0 inline-flex items-center px-4 pt-2 pb-1 mt-4 text-2xl font-medium leading-tight text-white rounded-l-full bg-secondary">
              {badeText}
        </span>
    {/if}
    {#if statusBadgeText}
        <span
          class="absolute top-0 right-0 inline-flex items-center py-2 pl-4 pr-2 pt-2.5 mt-16 text-xs font-black leading-tight rounded-l-full text-white {statusBadgeColor}">
          {statusBadgeText}
        </span>
    {/if}
  </div>

  <div class="flex flex-col justify-between flex-1">
    <div class="flex flex-col justify-start flex-1 px-4 pt-4 bg-white">
      <p class="text-lg uppercase text-primary font-title">
        {title}
      </p>
      <p class="pt-2 pb-4 text-sm text-light-500">
        {description}
      </p>
    </div>
    <div class="flex items-center p-4 border-t border-light-200">
      <div class="flex-shrink-0 w-10 h-10 rounded-xl">
        <IpfsImage cid={avatarCid} mimeType={avatarMimeType}/>
      </div>
      <div class="ml-3">
        <div class="text-sm font-medium leading-5 text-primary">
          <p href="#" class="hover:underline">
            {avatarName}
          </p>
        </div>
        <div class="text-xs leading-5 text-gray-600">
          {avatarStatus}
        </div>
      </div>
    </div>
    {#if actions}
      <div className="p-4 border-t border-light-200">
        <a className="flex items-center w-full space-x-4">
      {#each actions as action}
        <div>
          <button
              on:click={async (e) => {
                await action.action();
                e.preventDefault();
                e.stopPropagation();
            }}
            class="w-full px-4 py-2 font-semibold bg-transparent border-2 text-secondary border-secondary rounded-xl hover:bg-secondary hover:text-white hover:border-transparent">
            {#if action.mapping.design.icon}
              <Icon icon={action.mapping.design.icon}/>
            {/if}
            {action.mapping.data.label}
          </button>
        </div>
      {/each}
        </a>
      </div>
    {/if}
  </div>
</div>