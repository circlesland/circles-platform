<script lang="ts">
  import { requestUbi } from "../processes/requestUbi/requestUbi";
  import { transferCircles } from "../processes/transferCircles/transferCircles";
  import { setTrust } from "../processes/setTrust/setTrust";
  import { connectSafe } from "../processes/connectSafe/connectSafe";
  import { transferXDai } from "../processes/transferXDai/transferXDai";
  import Process from "../../../libs/o-views/molecules/Process.svelte";
  import { ProcessDefinition } from "../../../libs/o-processes/processManifest";
  import Button from "src/libs/o-views/atoms/Button.svelte";

  let process: ProcessDefinition;
  let contextInitializer;

  let runningProcess = window.stateMachines.current();
</script>

{#if runningProcess}
  <Process
    on:stopped={() => (runningProcess = null)}
    process={runningProcess} />
{:else if process}
  <Process
    on:stopped={() => (process = null)}
    {contextInitializer}
    definition={process} />
{:else}
  <div class="w-full p-4 space-y-2">
    <div class="space-y-2">
      <div
        on:click={() => {
          process = requestUbi;
          contextInitializer = null;
        }}>
        <Button text="Get basic income" type="secondary" />
      </div>
      <div class="flex space-x-2">
        <div
          class="w-full"
          on:click={() => {
            process = transferXDai;
            contextInitializer = null;
          }}>
          <Button text="Send xDai" type="secondary" />
        </div>
        <div
          class="w-full"
          on:click={() => {
            contextInitializer = (context) => {
              context.setTrust = { trustLimit: { type: 'percent', data: 100 } };
              return context;
            };
            process = setTrust;
          }}>
          <Button text="Trust friend" type="secondary" />
        </div>
      </div>
      <div class="flex space-x-2">
        <div class="w-full">
          <Button text="Receive Money" type="secondary" disabled />
        </div>
        <div
          class="w-full"
          on:click={() => {
            process = transferCircles;
            contextInitializer = null;
          }}>
          <Button text="Send Money" type="secondary" disabled />
        </div>
      </div>
      <!-- <div class="flex space-x-2">
        <div
          class="w-full p-2 font-bold text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white"
          on:click={() => {
            process = connectSafe;
            contextInitializer = null;
          }}>
          Connect Safe
        </div>
      </div> -->
    </div>
  </div>
{/if}
