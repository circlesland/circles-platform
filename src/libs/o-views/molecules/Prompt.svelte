<script lang="ts">
  import {PromptField} from "../../o-events/prompt";
  import {Process} from "../../../main";
  import StringInput from "../atoms/StringInput.svelte";
  import AddressInput from "../atoms/AddressInput.svelte";
  import EtherInput from "../atoms/EtherInput.svelte";

  export let process: Process;
  export let fields: PromptField[] = [];

</script>

{#each fields as field}
  <div class="flex w-full">
    {#if field.key}
      {#if field.type === "number"}
        number:
      {:else if field.type === "bigNumber"}
        <EtherInput bind:line={process.context.data[field.key]} />
      {:else if field.type === "string"}
        <StringInput bind:line={process.context.data[field.key]} />
      {:else if field.type === "ethereumAddress"}
        <AddressInput bind:line={process.context.data[field.key]} />
      {/if}
    {:else}
      {#if field.type === "title"}
        <h1>{field.props}</h1>
      {:else if field.type === "banner"}
        <h1>{field.props}</h1>
      {/if}
    {/if}
  </div>
{/each}

<!--
{#if promptId === 'success'}
  <h1
    class="w-full px-4 py-8 mb-4 text-center bg-white border rounded text-primary border-light-300">
    {status}
  </h1>
{:else if promptId === 'error'}
  <h1
    class="w-full px-4 py-8 mb-4 text-center bg-white border rounded text-primary border-light-300">
    {status}
  </h1>
{:else}
  <div>
    <h1
      class="w-full px-4 py-8 mb-4 text-center bg-white border rounded text-primary border-light-300">
      {status}
    </h1>
    {#each promptFields as promptField}
      <div class="flex w-full">
        {#if promptField.type === 'ethereumAddress'}
          <AddressInput
            label={promptField.label}
            isReadonly={promptField.isReadonly}
            bind:hexByteString={promptField.value}/>
        {:else if promptField.type === 'wei'}
          <EtherInput
            label={promptField.label}
            isReadonly={promptField.isReadonly}
            bind:ethValueString={promptField.value}/>
        {:else if promptField.type === 'string'}
          <StringInput
            label={promptField.label}
            isReadonly={promptField.isReadonly}
            bind:line={promptField.value}/>
        {:else if promptField.type === 'text'}
          <TextInput
            label={promptField.label}
            isReadonly={promptField.isReadonly}
            bind:text={promptField.value}/>
        {:else if promptField.type === 'bytestring'}
          <PrivateKeyInput
            label={promptField.label}
            isReadonly={promptField.isReadonly}
            bind:privateKeyPhrase={promptField.value}/>
        {:else}
          {JSON.stringify(promptField, null, 2)}
        {/if}
      </div>
    {/each}

    <div class="flex justify-center w-full h-16 py-2 space-x-3 text-center">
      <div
        class="w-full"
        on:click={() => {
          const answer = { type: 'omo.answer', message: '', data: { id: promptId, fields: promptFields } };
          process.sendEvent(answer);
          console.log('Sent', answer);
        }}>
        <Button text="Next" type="primary"/>
      </div>
    </div>
  </div>
{/if}
-->
