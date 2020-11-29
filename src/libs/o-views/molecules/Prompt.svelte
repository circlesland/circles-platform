<script lang="ts">
  import Button from "../../o-views/atoms/Button.svelte";
  import {Button as ButtonMapping} from "./../interfaces/atoms";
  import {ProcessArtifact} from "../../o-processes/interfaces/processArtifact";
  import {Prompt} from "../../o-processes/events/prompt";
  import {Continue} from "../../o-processes/events/continue";
  import {Process} from "../../o-processes/interfaces/process";
  import EtherEditor from "../atoms/editors/EtherEditor.svelte";
  import StringEditor from "../atoms/editors/StringEditor.svelte";
  import AddressEditor from "../atoms/editors/AddressEditor.svelte";
  import TextEditor from "../atoms/editors/TextEditor.svelte";
  import KeyphraseEditor from "../atoms/editors/KeyphraseEditor.svelte";
  import FileEditor from "../atoms/editors/FileEditor.svelte";

  export let process: Process;
  export let prompt: Prompt;

  let processArtifacts: ProcessArtifact[];

  let isValid: boolean = true;
  let nextButton: ButtonMapping;

  $: {
    if (prompt)
    {
      processArtifacts = Object.keys(prompt.data).map(
        (key) => prompt.data[key]
      );
      setIsValid();
    }
  }

  function setIsValid()
  {
    isValid =
      !processArtifacts ||
      processArtifacts.reduce((p, c) => p && (c.isValid ?? false), true);

    nextButton = {
      data: {
        label: prompt.nextButtonTitle ? prompt.nextButtonTitle : "Next",
      },
      design: {
        type: "primary",
        disabled: !isValid,
      },
    };
  }

  function sendAnswer()
  {
    processArtifacts.forEach((changedArtifact) =>
    {
      prompt.data[changedArtifact.key] = changedArtifact;
      prompt.data[changedArtifact.key].changed = true; // TODO: Set this property only if the value changed
    });

    process.sendEvent(<Continue>{
      type: "process.continue",
      data: prompt.data,
    });
  }

  setIsValid();
</script>

{#if prompt.banner && prompt.banner.component}
  <div class="w-full">
    <svelte:component
      this={prompt.banner.component}
      data={prompt.banner.data} />
  </div>
{/if}
{#each processArtifacts as artifact}
  <div class="w-full">
    {#if artifact.type === 'ether'}
      <EtherEditor
        on:validated={() => setIsValid()}
        processArtifact={artifact} />
    {:else if artifact.type === 'string'}
      <StringEditor
        on:validated={() => setIsValid()}
        processArtifact={artifact} />
    {:else if artifact.type === 'text'}
      <TextEditor
        on:validated={() => setIsValid()}
        processArtifact={artifact} />
    {:else if artifact.type === 'keyphrase'}
      <KeyphraseEditor
        on:validated={() => setIsValid()}
        processArtifact={artifact} />
    {:else if artifact.type === 'ethereumAddress'}
      <AddressEditor
        on:validated={() => setIsValid()}
        processArtifact={artifact} />
    {:else if artifact.type === 'file'}
      <FileEditor
        on:validated={() => setIsValid()}
        processArtifact={artifact} />
    {:else if artifact.type === 'secretString'}
      <input
        type="password"
        rounded-xl
        bind:value={artifact.value}
        placeholder={artifact.label}
        class="w-full p-2 mb-2 text-xl bg-transparent border border-gray-300 rounded-xl text-primary" />
    {:else if artifact.type === 'boolean'}
      <input
        type="checkbox"
        bind:checked={artifact.value}
        placeholder={artifact.label}
        class="w-full p-2 mb-2 text-xl bg-transparent border border-gray-300 rounded-xl text-primary" />
    {/if}
  </div>
{/each}

{#if !prompt.hideNextButton}
  <div class="flex justify-center w-full h-16 py-2 space-x-3 text-center">
    <div class="w-full" on:click={sendAnswer}>
      <Button mapping={nextButton} />
    </div>
  </div>
{/if}
