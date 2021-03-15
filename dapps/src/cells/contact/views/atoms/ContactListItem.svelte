<script lang="ts">
  import {Contact} from "omo-central/dist/generated";
  import {createEventDispatcher} from "svelte";
  import ListItem from "../../../_generic/views/atoms/ListItem.svelte";
  import {QuickAction} from "omo-kernel-interfaces/dist/quickAction";

  export let contact: Contact;
  export let actions:QuickAction[] = [];
  const dispatch = createEventDispatcher();
</script>

<ListItem
  imageCid={contact.contactProfile.omoAvatarCid}
  actions={actions}
  title="{contact.contactProfile.omoFirstName} {contact.contactProfile.omoLastName}"
  description="{contact.contactProfile.fissionName}"
>
  <span class="text-primary">Known since: {contact.createdAt}</span>
</ListItem>

<!--
<div class="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
  <div class="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
    <div class="flex items-center space-x-4">
      <img src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144" alt="" class="w-10 sm:w-16 h-10 sm:h-16 rounded-full">
      <div class="flex flex-col leading-tight">
        <div class="text-2xl mt-1 flex items-center">
          <span class="text-gray-700 mr-3">Anderson Vanhron</span>
          <span class="text-green-500">
                  <svg width="10" height="10">
                     <circle cx="5" cy="5" r="5" fill="currentColor"></circle>
                  </svg>
               </span>
        </div>
        <span class="text-lg text-gray-600">Junior Developer</span>
      </div>
    </div>
    <div class="flex items-center space-x-2">
      <button type="button" class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </button>
      <button type="button" class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      </button>
      <button type="button" class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
      </button>
    </div>
  </div>









<div>
  {#if contact}
    <div
      on:click={toggleExpand}
      class="w-full bg-white border rounded-xl card border-light-200">
      <div class="flex items-center justify-center p-2 rounded-lg">
        <img src={getPicture()} alt="CRC" class="rounded-lg" />
      </div>
      <div class="flex items-center">
        <div class="px-1 py-2">
          <div class="text-xs md:text-base text-primary">
            {contact.contactProfile.omoFirstName}
            {contact.contactProfile.omoLastName}
          </div>
          <p class="text-gray-500 text-xxs md:text-xs">
            <span class="text-gray-500">
              {contact.contactProfile.fissionName}
            </span>
          </p>
        </div>
      </div>
      <div class="flex justify-end p-2 space-x-2 overflow-hidden text-right">
        <div class="text-3xl font-light text-action">
          <span style="white-space:nowrap; display: inline-block">

          </span>
        </div>
      </div>
    </div>
    {#if contact.contactProfile && openDetail}
      <div class="px-3">
        <div
          class="w-full p-2 text-gray-500 bg-white border-b border-l border-r rounded-b-xl text-xxs md:text-xs border-light-200">
          <span class="text-primary">Known since: {contact.createdAt}</span>
        </div>
      </div>
    {/if}
  {:else}
    loading ..
  {/if}
</div>
-->

