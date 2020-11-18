<script lang="ts">
  import { PromptField } from "../../o-processes/processEvent";
  import AddressInput from "../atoms/AddressInput.svelte";
  import EtherInput from "../atoms/EtherInput.svelte";
  import StringInput from "../atoms/StringInput.svelte";
  import TextInput from "../atoms/TextInput.svelte";
  import PrivateKeyInput from "../atoms/PrivateKeyInput.svelte";
  import PercentInput from "../atoms/PercentInput.svelte";
  import BN from "bn.js";
  import Button from "../atoms/Button.svelte";

  export let promptFields: { key: string; field: PromptField }[] = [];
  export let promptId: string = "";
  export let process;
  export let status;

  let promptFieldValues: { [key: string]: { type: string; data: any } } = {};
</script>

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
        {#if promptField.field.type === 'ethereumAddress'}
          <AddressInput
            label={promptField.field.label}
            isReadonly={promptField.field.isReadonly}
            hexByteString={promptField.field.value ? promptField.field.value.data : ''}
            on:value={(event) => {
              const key = promptField.key;
              promptFieldValues[key] = event.detail;
            }} />
        {:else if promptField.field.type === 'wei'}
          <EtherInput
            label={promptField.field.label}
            isReadonly={promptField.field.isReadonly}
            weiValueBN={promptField.field.value ? promptField.field.value.data : new BN(0)}
            on:value={(event) => {
              const key = promptField.key;
              promptFieldValues[key] = event.detail;
            }} />
        {:else if promptField.field.type === 'string'}
          <StringInput
            label={promptField.field.label}
            isReadonly={promptField.field.isReadonly}
            line={promptField.field.value ? promptField.field.value.data : ''}
            on:value={(event) => {
              const key = promptField.key;
              promptFieldValues[key] = event.detail;
            }} />
        {:else if promptField.field.type === 'text'}
          <TextInput
            label={promptField.field.label}
            isReadonly={promptField.field.isReadonly}
            text={promptField.field.value ? promptField.field.value.data : ''}
            on:value={(event) => {
              const key = promptField.key;
              promptFieldValues[key] = event.detail;
            }} />
        {:else if promptField.field.type === 'bytestring'}
          <PrivateKeyInput
            label={promptField.field.label}
            isReadonly={promptField.field.isReadonly}
            on:value={(event) => {
              const key = promptField.key;
              promptFieldValues[key] = event.detail;
            }} />
        {:else if promptField.field.type === 'percent'}
          <PercentInput
            label={promptField.field.label}
            isReadonly={promptField.field.isReadonly}
            percentValue={promptField.field.value ? promptField.field.value.data : 0}
            on:value={(event) => {
              const key = promptField.key;
              promptFieldValues[key] = event.detail;
            }} />
        {:else}{JSON.stringify(promptField, null, 2)}{/if}
      </div>
    {/each}

    <div class="flex justify-center w-full h-16 py-2 space-x-3 text-center">
      <!-- <button
                class="px-6 py-2 font-bold uppercase bg-gray-200 border rounded border-light-400 text-primary"
                on:click={() => {
      process.sendEvent({ type: 'omo.cancel' });
      process = null;
    }}>
    cancel   
        </button> -->
      <div
        class="w-full"
        on:click={() => {
          const answer = { type: 'omo.answer', message: '', data: { id: promptId, fields: promptFieldValues } };
          process.sendEvent(answer);
          console.log('Sent', answer);
          promptFieldValues = {};
        }}>
        <Button text="Next" type="primary" />
      </div>
    </div>
  </div>
{/if}
