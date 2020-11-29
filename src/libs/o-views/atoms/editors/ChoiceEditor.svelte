<script lang="ts">
  import { ProcessArtifact } from "../../../o-processes/interfaces/processArtifact";
  import { config } from "../../../o-circles-protocol/config";
  import { createEventDispatcher, onMount } from "svelte";
  import Button from "../../../o-views/atoms/Button.svelte";

  export let processArtifact: ProcessArtifact;
  const dispatch = createEventDispatcher();

</script>

{#if processArtifact}
  <div class="w-full">
    {#if processArtifact.label}
      <p class="mb-1 text-xs text-gray-700 uppercase">
        {processArtifact.label}
      </p>
    {/if}
    <div class="flex">
      {#each processArtifact.choices as choice}
        <div
          on:click={() => {
            processArtifact.value = choice;
            processArtifact.isValid = true;
            dispatch("submit");
          }}>
        <Button
          mapping={{
            data: {
              label: choice
            },
            design: {
              type: 'primary'
            }
          }} />
        </div>
      {/each}
    </div>
  </div>
{/if}
