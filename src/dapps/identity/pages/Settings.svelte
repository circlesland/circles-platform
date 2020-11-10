<script lang="ts">
  import dayjs from "dayjs";

  let safeOwner: string;
  let safeAddress: string;
  let privateKey: string;
  let lastUbiRetrieval: string;
  let lastSuccessfulUbiRetrieval: string;

  safeOwner = localStorage.getItem("omo.address");
  safeAddress = localStorage.getItem("omo.safeAddress");
  privateKey = localStorage.getItem("omo.privateKey");
  lastUbiRetrieval = localStorage.getItem("omo.lastUbiRetrieval");
  lastSuccessfulUbiRetrieval = localStorage.getItem(
    "omo.ubiService.lastSuccessfulUbiRetrieval"
  );
</script>

<style>
  .grid {
    display: grid;
    grid-template-rows: 1fr auto;
  }
</style>

<div
  class="flex flex-col items-center justify-center h-full bg-white bg-center bg-cover"
  style="background-image: url(/images/background.webp)">
  <div
    class="justify-center w-full h-full max-w-lg bg-white shadow-2xl wrap md:m-12"
    style="max-height: 900px">
    <div class="grid w-full h-full">
      <div class="mx-6 my-4 overflow-x-hidden">
        <h1 class="text-xl">My Odentity</h1>
        <div class="text-lg">Localstorage Data</div><br />
        <div class="uppercase">SafeOwner:</div>
        <p>
          {#if safeOwner}{safeOwner}{/if}
        </p><br />
        <div class="uppercase">PrivateKey:</div>
        <p>
          {#if privateKey}{privateKey}{/if}
        </p>
        <br />
        <div class="uppercase">GnosisSafe Address:</div>
        <p>
          {#if safeAddress}{safeAddress}{/if}
        </p>
        <br />
        <div class="uppercase">Last Ubi Call:</div>
        <p>
          {#if lastUbiRetrieval}{dayjs(lastUbiRetrieval).fromNow()}{/if}
        </p>
        <br />
        <div class="uppercase">Last Successfull Ubi Call:</div>
        <p>
          {#if lastSuccessfulUbiRetrieval}
            {dayjs(lastSuccessfulUbiRetrieval).fromNow()}
          {/if}
        </p>
      </div>
      <div
        class="flex justify-center w-full p-4 space-x-3 text-center border-t border-gray-300">
        <a
          href="#/dapps"
          class="w-full px-2 py-4 font-bold text-white uppercase rounded bg-primary">back</a>
        <p
          class="w-full px-2 py-4 font-bold text-white uppercase bg-pink-800 rounded">
          logout
        </p>
      </div>
    </div>
  </div>
</div>
