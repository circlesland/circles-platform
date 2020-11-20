<script lang="ts">
  export let data = {
    subtitle: "",
  };

  export let address: string = "";
</script>

<div
  class="flex items-center justify-center text-4xl font-bold text-center text-white bg-primary">
  <div>
    {#if address}
      <img
        src="https://avatars.dicebear.com/api/avataaars/{address}.svg"
        class="w-32 h-32 mx-auto mt-4 bg-white border-4 rounded-full border-light-300"
        alt="name" />
    {/if}
    <div class="py-4 mt-2 font-bold">
      <div class="text-3xl">
        {#if address}Hello Omo{:else}Welcome{/if}
      </div>
      {#if !address}
        <div class="text-base">{data.subtitle}</div>
      {/if}
    </div>
  </div>
</div>
