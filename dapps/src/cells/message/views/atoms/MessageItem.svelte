<script lang="ts">
  import {Message} from "omo-central/dist/generated";
  import {createEventDispatcher} from "svelte";
  import IpfsImage from "../../../../libs/o-views/atoms/IpfsImage.svelte";

  export let message: Message;
  export let side: "left"|"right" = "right";

  const dispatch = createEventDispatcher();
</script>

<div class="chat-message">
  <div class="flex items-end {side === 'right' ? 'justify-end' : ''}">
    <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
      <div><span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">{message.content}</span></div>
    </div>
    {#if message.sender.omoAvatarCid}
      <IpfsImage
        cid={message.sender.omoAvatarCid ? message.sender.omoAvatarCid : undefined}
        mimeType={message.sender.omoAvatarMimeType ? message.sender.omoAvatarMimeType : undefined}
        classes="w-6 h-6 rounded-full order-1"
      />
    {/if}
  </div>
</div>