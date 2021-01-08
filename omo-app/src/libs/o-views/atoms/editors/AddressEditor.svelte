<script lang="ts">
  import {ProcessArtifact} from "../../../o-processes/interfaces/processArtifact";
  import {config} from "../../../o-circles-protocol/config";
  import {createEventDispatcher, onMount} from "svelte";
  import {tryGetDappState} from "../../../o-os/loader";
  import {OmoSafeState} from "../../../../dapps/safe/manifest";
  import {Contact} from "../../../o-circles-protocol/model/contact";
  import Typeahead from "../svelte-typeahead/Typeahead.svelte";
  import FriendItem from "../../molecules/FriendItem.svelte";
  import {OmoSapienState} from "../../../../dapps/omosapien/manifest";

  export let processArtifact: ProcessArtifact;
  const dispatch = createEventDispatcher();

  interface Entry {
    fissionName: string;
    circlesSafe: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
  }

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

  let hideDropdown = true;
  let lookupContacts: Contact[] = [];
  let contactsBySafeAddress: {
    [safeAddress: string]: Contact
  } = {};

  function loadDirectoryContacts()
  {
    if (!contactsBySafeAddress)
    {
      contactsBySafeAddress = {};
    }
    const omoSapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");
    Object.values(omoSapienState.directory.byFissionName).forEach((omo:Entry) =>
    {
      if (omo.circlesSafe && !contactsBySafeAddress[omo.circlesSafe])
      {
        contactsBySafeAddress[omo.circlesSafe] = <Contact>{
          safeAddress: omo.circlesSafe,
          circlesProfile: null,
          trust: {
            out: 0,
            in: 0
          },
          lastBlockNo: 0,
          omoProfile: {
            profile: {
              firstName: omo.firstName,
              lastName: omo.lastName,
              fissionName: omo.fissionName,
              avatar: omo.avatarUrl,
              name: "",
              circlesAddress: omo.circlesSafe
            },
            avatar: ""
          }
        }
      }
    });
    lookupContacts = Object.values(contactsBySafeAddress);
  }

  onMount(() =>
  {
    const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
    if (safeState.myContacts)
    {
      safeState.myContacts.subscribe(contacts =>
      {
        contacts.forEach(contact =>
        {
          if (!contact.safeAddress)
          {
            return;
          }
          if (!contactsBySafeAddress)
          {
            contactsBySafeAddress = {};
          }
          contactsBySafeAddress[contact.safeAddress] = contact;
        });
        lookupContacts = Object.values(contactsBySafeAddress);
      });
    }

    loadDirectoryContacts();
    validate();
    if (processArtifact && processArtifact.isValid)
    {
      hideDropdown = true;
    }
  });

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

  function mapToFriendItem(contactOrAddress: Contact | string)
  {
    let contact: Contact = null;

    if (typeof contactOrAddress === "string")
    {
      contact = contactsBySafeAddress[contactOrAddress];
      if (!contact)
      {
        return contactOrAddress;
      }
    }
    else
    {
      contact = contactOrAddress;
    }

    const listItem:{
      image: string,
      title: string,
      detail: {
        address: string,
        trust: {
          in: number
          out: number
        },
      },
      actions: string[]
    } = {};

    if (contact.omoProfile)
    {
      if (contact.omoProfile.avatar)
      {
        listItem.image = contact.omoProfile.avatar;
      }
      listItem.title = `${contact.omoProfile.profile.firstName} ${contact.omoProfile.profile.lastName}`
    }
    else if (contact.circlesProfile)
    {
      listItem.image = contact.circlesProfile?.avatarUrl;
      listItem.title = contact.circlesProfile.username;
    }
    else
    {
      listItem.title = contact.safeAddress.slice(0, 8);
    }

    if (!listItem.image)
    {
      listItem.image = "https://avatars.dicebear.com/api/avataaars/" + contact.safeAddress + ".svg"
    }

    listItem.detail = {
      address: contact.safeAddress,
      trust: {
        in: contact.trust.in,
        out: contact.trust.out
      }
    };

    listItem.actions = [];
    return listItem;
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
          hideDropdown={hideDropdown}
          data={processArtifact.enableAutocomplete ? lookupContacts : []}
          extract={extractSearchKey}
          format={(original) => mapToFriendItem(original).detail.address}
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
            {#if typeof mapToFriendItem(result.original.safeAddress) !== "string"}
              <FriendItem showActions={false} data={mapToFriendItem(result.original.safeAddress)} />
            {:else}
              {result.original.safeAddress}
            {/if}
          </div>
        </Typeahead>
      </div>
    {:else if typeof mapToFriendItem(processArtifact.value) !== "string"}
      <FriendItem showActions={false} data={mapToFriendItem(processArtifact.value)} />
    {:else}
      {processArtifact.value}
    {/if}
  </div>
{/if}
