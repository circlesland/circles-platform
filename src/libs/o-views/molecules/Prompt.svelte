<script lang="ts">
  import { ProcessEvent, PromptField } from "src/processes/processEvent";
  import AccountInput from "src/libs/o-views/atoms/AddressInput.svelte";
  import EtherInput from "src/libs/o-views/atoms/fields/EtherInput.svelte";
  import StringInput from "src/libs/o-views/atoms/fields/StringInput.svelte";
  import TextInput from "src/libs/o-views/atoms/fields/TextInput.svelte";
  import { Process } from "src/main";

  export let process: Process;
  export let promptFields: { [id: string]: PromptField } = {};

  function submit() {
    if (!process) throw new Error("No process!");

    const filledFields = Object.keys(promptFields)
      .map((id) => {
        return {
          id,
          field: promptFields[id],
        };
      })
      .filter((item) => item.field.value)
      .map((item) => {
        return {
          id: item.id,
          value: item.field.value,
        };
      });

    process.sendEvent(<ProcessEvent>{
      type: "omo.answer",
      data: {
        fields: filledFields,
      },
    });
  }

  function cancel() {
    if (!process) throw new Error("No process!");

    process.sendEvent(<ProcessEvent>{
      type: "omo.cancel",
      message: "The process was cancelled from a user dialog.",
    });
  }
</script>

{#each promptFields as promptField}
  <Label>
    <p>{promptField.label}:</p>
    {#if promptField.type === 'account'}
      <AccountInput
        on:value={(event) => {
          promptFields[promptField.id].value = event.detail.data;
        }} />
    {:else if promptField.type === 'ether'}
      <EtherInput
        on:value={() => {
          promptFields[promptField.id].value = event.detail.data;
        }} />
    {:else if promptField.type === 'string'}
      <StringInput
        on:value={() => {
          promptFields[promptField.id].value = event.detail.data;
        }} />
    {:else if promptField.type === 'text'}
      <TextInput
        on:value={() => {
          promptFields[promptField.id].value = event.detail.data;
        }} />
    {/if}
  </Label>
{/each}
<p>
  <button on:click={submit}>Submit</button><br />
  <button on:click={cancel}>Cancel</button>
</p>
