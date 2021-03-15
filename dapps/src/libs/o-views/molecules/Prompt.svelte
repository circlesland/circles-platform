<script lang="ts">
  import Button from "../../o-views/atoms/Button.svelte";
  import {Button as ButtonMapping} from "./../interfaces/atoms";
  import EtherEditor from "../atoms/editors/EtherEditor.svelte";
  import StringEditor from "../atoms/editors/StringEditor.svelte";
  import AddressEditor from "../atoms/editors/AddressEditor.svelte";
  import TextEditor from "../atoms/editors/TextEditor.svelte";
  import KeyphraseEditor from "../atoms/editors/KeyphraseEditor.svelte";
  import ImageEditor from "../atoms/editors/ImageEditor.svelte";
  import ChoiceEditor from "../atoms/editors/ChoiceEditor.svelte";
  import InviteCreditEditor from "../atoms/editors/InviteCreditEditor.svelte";
  import OEditor from "../atoms/editors/OEditor.svelte";
  import LocationEditor from "../atoms/editors/LocationEditor.svelte";
  import {Process} from "omo-process/dist/interfaces/process";
  import {Prompt} from "omo-process/dist/events/prompt";
  import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
  import {Continue} from "omo-process/dist/events/continue";
  import {Sinker} from "../../../dapps/identity/events/process/ipc/sinker";
  import {Bubble} from "../../../dapps/identity/events/process/ipc/bubble";

  export let process: Process;
  export let prompt: Prompt;
  export let bubble: Bubble;

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
    if (!isValid)
    {
      console.warn("The data in the current prompt is not valid. Cannot send the answer.")
      return;
    }

    processArtifacts.forEach((changedArtifact) =>
    {
      prompt.data[changedArtifact.key] = changedArtifact;
      prompt.data[changedArtifact.key].changed = true; // TODO: Set this property only if the value changed
    });

    // TODO: Remove the regular 'sendEvent' in favor of the 'process.ipc.sinker' when all processes have been migrated.
    process.sendEvent(<Continue>{
      type: "process.continue",
      data: prompt.data,
    });

    process.sendEvent(<Sinker>{
      type:"process.ipc.sinker",
      levels: bubble?.levels ?? 0,
      backTrace: bubble.trace,
      wrappedEvent: {
        type: "process.continue",
        data: prompt.data
      }
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
  <div
    class="w-full"
    on:keydown={(e) => {
      if (e.key === 'Enter' && isValid) sendAnswer();
    }}>
    {#if artifact.type === 'ether'}
      <EtherEditor
        on:validated={() => setIsValid()}
        processArtifact={artifact} />
    {:else if artifact.type === 'string'}
      <StringEditor
        on:validated={() => setIsValid()}
        processArtifact={artifact} />
    {:else if artifact.type === 'o'}
      <OEditor on:validated={() => setIsValid()} processArtifact={artifact} />
    {:else if artifact.type === 'location'}
      <LocationEditor on:validated={() => setIsValid()} processArtifact={artifact} />
    {:else if artifact.type === 'text'}
      <TextEditor
        on:validated={() => setIsValid()}
        processArtifact={artifact} />
    {:else if artifact.type === 'keyphrase'}
      <KeyphraseEditor
        on:validated={() => setIsValid()}
        processArtifact={artifact} />
    {:else if artifact.type === 'choice'}
      <ChoiceEditor
        on:validated={() => setIsValid()}
        on:submit={() => sendAnswer()}
        processArtifact={artifact} />
    {:else if artifact.type === 'ethereumAddress'}
      <AddressEditor
        on:validated={() => setIsValid()}
        processArtifact={artifact} />
    {:else if artifact.type === 'inviteCredits'}
      <InviteCreditEditor
        on:validated={() => setIsValid()}
        processArtifact={artifact} />
    {:else if artifact.type === 'file'}
      <ImageEditor
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
