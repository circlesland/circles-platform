<script lang="ts">
  import { Jumper } from "svelte-loading-spinners";
  import { onMount } from "svelte";
  import { ProcessEnvironment } from "../../../../libs/o-processes/interfaces/processEnvironment";

  let environment: ProcessEnvironment;
  export let data:{
    header:string,
    subHeader:string,
    body:string
  }

  async function init() {
    environment = await getEnvironment();
    reload();
  }

  async function reload() {}

  onMount(() => init());
</script>

<div class="mb-6">
  <p class="py-12 text-lg text-center text-primary">
    <span class="text-3xl">{@html data.header}</span>
    <br />{@html data.subHeader}
  </p><br />
  <div class="text-xs text-center text-light-500">
    {#if data.body}
      {@html data.body}
    {:else}
      <div class="">
        <Jumper size="60" color="#fff" unit="px" />
      </div>
    {/if}
  </div>
</div>
