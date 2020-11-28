<script lang="ts">
  import Button from "../../o-views/atoms/Button.svelte";
  import { ProcessArtifact } from "../../o-processes/interfaces/processArtifact";
  import { Prompt } from "../../o-processes/events/prompt";
  import { Continue } from "../../o-processes/events/continue";
  import { Process } from "../../o-processes/interfaces/process";

  export let process: Process;
  export let prompt: Prompt;

  let processArtifacts: ProcessArtifact[];

  $: {
    if (prompt) {
      processArtifacts = Object.keys(prompt.data).map(
        (key) => prompt.data[key]
      );
    }
  }

  function sendAnswer() {
    processArtifacts.forEach((changedArtifact) => {
      prompt.data[changedArtifact.key] = changedArtifact;
      prompt.data[changedArtifact.key].changed = true; // TODO: Set this property only if the value changed
    });

    process.sendEvent(<Continue>{
      type: "process.continue",
      data: prompt.data,
    });
  }
</script>

{#if prompt && prompt.banner}
  <div class="w-full">
    <svelte:component this={prompt.banner} data={prompt.data} />
  </div>
{/if}
{#each processArtifacts.filter((o) => !o.isHidden) as artifact}
  <div class="w-full">
    <!-- <p class="mb-1 text-xs text-gray-700 uppercase">{artifact.label}</p> -->
    {#if artifact.type === 'number'}
      <input
        type="number"
        bind:value={artifact.value}
        placeholder={artifact.label}
        class="w-full p-2 mb-2 text-xl bg-transparent border border-gray-300 rounded-lg text-primary" />
    {:else if artifact.type === 'string'}
      <input
        type="text"
        bind:value={artifact.value}
        placeholder={artifact.label}
        class="w-full p-2 mb-2 text-xl bg-transparent border border-gray-300 rounded-lg text-primary" />
    {:else if artifact.type === 'ethereumAddress'}
      <input
        type="text"
        bind:value={artifact.value}
        placeholder={artifact.label}
        class="w-full p-2 mb-2 text-xl bg-transparent border border-gray-300 rounded-lg text-primary" />
    {:else if artifact.type === 'secretString'}
      <input
        type="password"
        bind:value={artifact.value}
        placeholder={artifact.label}
        class="w-full p-2 mb-2 text-xl bg-transparent border border-gray-300 rounded-lg text-primary" />
    {:else if artifact.type === 'boolean'}
      <input
        type="checkbox"
        bind:checked={artifact.value}
        placeholder={artifact.label}
        class="w-full p-2 mb-2 text-xl bg-transparent border border-gray-300 rounded-lg text-primary" />
    {/if}
  </div>
{/each}

<div class="flex justify-center w-full h-16 py-2 space-x-3 text-center">
  <div class="w-full" on:click={sendAnswer}>
    <Button
      mapping={{ data: { label: prompt.nextButtonTitle ? prompt.nextButtonTitle : 'Next' }, design: { type: 'primary' } }} />
  </div>
</div>
