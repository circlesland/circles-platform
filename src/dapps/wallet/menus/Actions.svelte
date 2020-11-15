<script lang="ts">
  import { requestUbi } from "../processes/requestUbi/requestUbi";
  import { transferCircles } from "../processes/transferCircles/transferCircles";
  import { setTrust } from "../processes/setTrust/setTrust";
  import { connectSafe } from "../processes/connectSafe/connectSafe";
  import { transferXDai } from "../processes/transferXDai/transferXDai";
  import Process from "../../../libs/o-views/molecules/Process.svelte";
  import { ProcessDefinition } from "../../../libs/o-processes/processManifest";

  let process: ProcessDefinition;
  let contextInitializer;
</script>

{#if process}
  <Process
    on:stopped={() => (process = null)}
    {contextInitializer}
    definition={process} />
{:else}
  <div class="w-full p-4 space-y-2 border-t border-gray-300 rounded-t-xl">
    <div class="space-y-2">
      <div
        class="w-full p-2 font-bold text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white"
        on:click={() => {
          process = requestUbi;
          contextInitializer = null;
        }}>
        Get Universal basic income
      </div>
      <div class="flex space-x-2">
        <div
          class="w-full p-2 font-bold text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white"
          on:click={() => {
            contextInitializer = (context) => {
              context.setTrust = { trustLimit: { type: 'percent', data: 100 } };
              return context;
            };
            process = setTrust;
          }}>
          add friend
        </div>
      </div>
      <div class="flex space-x-2">
        <div
          class="w-full p-2 font-bold text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white">
          Receive Money
        </div>
        <div
          class="w-full p-2 font-bold text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white"
          on:click={() => {
            process = transferCircles;
            contextInitializer = null;
          }}>
          Send Circles
        </div>
        <div
          class="w-full p-2 font-bold text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white"
          on:click={() => {
            process = transferXDai;
            contextInitializer = null;
          }}>
          Send xDai
        </div>
      </div>
      <div class="flex space-x-2">
        <div
          class="w-full p-2 font-bold text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white"
          on:click={() => {
            process = connectSafe;
            contextInitializer = null;
          }}>
          Connect Safe
        </div>
      </div>
    </div>
  </div>
{/if}
