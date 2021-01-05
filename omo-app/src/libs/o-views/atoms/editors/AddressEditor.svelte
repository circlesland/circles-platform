<script lang="ts">
  import {ProcessArtifact} from "../../../o-processes/interfaces/processArtifact";
  import {config} from "../../../o-circles-protocol/config";
  import {createEventDispatcher, onMount} from "svelte";
  import {tryGetDappState} from "../../../o-os/loader";
  import {OmoSafeState} from "../../../../dapps/safe/manifest";
  import {Contact} from "../../../o-circles-protocol/model/contact";
  import Typeahead from "../svelte-typeahead/Typeahead.svelte";

  export let processArtifact: ProcessArtifact;
  const dispatch = createEventDispatcher();

  function validate()
  {
    if (
      (!processArtifact.value ||
        processArtifact.value.toString().trim() === "") &&
      processArtifact.isOptional
    )
    {
      processArtifact.isValid = true;
    }
    else
    {
      processArtifact.isValid =
        processArtifact.value && processArtifact.value.startsWith("0x");
      if (processArtifact.isValid)
      {
        processArtifact.isValid = config
          .getCurrent()
          .web3()
          .utils.isAddress(processArtifact.value);
      }
    }
    dispatch("validated", processArtifact.isValid);
  }

  $: {
    if (processArtifact && processArtifact.value)
    {
      validate();
    }
  }

  let lookupContacts: Contact[] = [];
  let contactsBySafeAddress: {
    [safeAddress:string]: Contact
  };

  onMount(() =>
  {
    const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
    safeState.myContacts.subscribe(contacts =>
    {
      lookupContacts = contacts;
      contacts.forEach(contact => {
        if (!contact.safeAddress)
        {
          return;
        }
        if (!contactsBySafeAddress)
        {
          contactsBySafeAddress = {};
        }
        contactsBySafeAddress[contact.safeAddress] = contact;
      })
    });

    validate();
  });

  function getDisplayName(itemOrAddress: Contact|string)
  {
    let item:Contact = null;

    if (typeof itemOrAddress === "string")
    {
      item = contactsBySafeAddress[itemOrAddress];
      if (!item)
      {
        return itemOrAddress;
      }
    }
    else
    {
      item = itemOrAddress;
    }

    if (item.omoProfile && item.omoProfile.profile)
    {
      return item.omoProfile.profile.firstName + " " + item.omoProfile.profile.lastName;
    }
    if (item.circlesProfile && item.circlesProfile.username)
    {
      return item.circlesProfile.username;
    }

    return item.safeAddress;
  }

  function extractSearchKey(item: Contact)
  {
    let searchKey = "";

    if (item.omoProfile && item.omoProfile.profile)
    {
      searchKey += item.omoProfile.profile.firstName + " " + item.omoProfile.profile.lastName;
    }
    if (item.circlesProfile && item.circlesProfile.username)
    {
      searchKey += item.circlesProfile.username;
    }

    searchKey += item.safeAddress;

    return searchKey;
  }
</script>

{#if processArtifact && contactsBySafeAddress}
  <div class="w-full">
    <div class="flex items-center justify-between w-full">
      <p class="mb-1 text-xs text-gray-700 uppercase">
        {#if processArtifact.label}
          {processArtifact.label}
        {/if}
      </p>
      {#if processArtifact.isReadonly}
        <p class="mb-1 text-xs text-gray-700 uppercase cursor-pointer" on:click={() => {navigator.clipboard.writeText(!processArtifact.value ? "" : processArtifact.value)}}>
          Copy to clipboard
        </p>
      {/if}
    </div>
    {#if !processArtifact.isReadonly}
      <div
        class:border-action={processArtifact.isValid}
        class:border-danger={!processArtifact.isValid}>
        <Typeahead
          placeholder={`Search for contacts or enter an address`}
          hideLabel
          data={lookupContacts}
          extract={extractSearchKey}
          format={getDisplayName}
          let:result
          let:index
          bind:value={processArtifact.value}
          on:select="{(e) => {
            if (e.detail.selected.safeAddress)
            {
              processArtifact.value = e.detail.selected.safeAddress;
            } else {
              processArtifact.value = e.detail.selected;
            }
            validate();
          }}"
          on:clear="{() => {
            processArtifact.value = null;
            validate();
          }}">
          <div>
            {getDisplayName(result.original)}<br/>
            ({result.original.safeAddress})
          </div>
        </Typeahead>
      </div>
    {:else}
      {#if getDisplayName(processArtifact.value) != processArtifact.value}
        Address: {processArtifact.value}<br/> <!-- @Samuel: Kannst Du dann stylen ;) -->
        <input
          readonly={processArtifact.isReadonly ? 'readonly' : ''}
          class:border-action={processArtifact.isValid}
          class:border-danger={!processArtifact.isValid}
          placeholder={processArtifact.placeholder ? processArtifact.placeholder : '0x123XMaMaXOm0...'}
          type="text"
          minlength="42"
          maxlength="42"
          value={getDisplayName(processArtifact.value)}
          class="w-full p-3 mb-2 text-xl bg-transparent border-2 border-gray-300 rounded-lg outline-none text-primary" />
      {:else}
        <input
          readonly={processArtifact.isReadonly ? 'readonly' : ''}
          class:border-action={processArtifact.isValid}
          class:border-danger={!processArtifact.isValid}
          placeholder={processArtifact.placeholder ? processArtifact.placeholder : '0x123XMaMaXOm0...'}
          type="text"
          minlength="42"
          maxlength="42"
          value={processArtifact.value}
          class="w-full p-3 mb-2 {getDisplayName(processArtifact.value) == processArtifact.value ? 'text-xl' : 'text'} bg-transparent border-2 border-gray-300 rounded-lg outline-none text-primary" />
      {/if}
    {/if}
  </div>
{/if}
