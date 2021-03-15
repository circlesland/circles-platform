<!-- Avatar on the top, name and other details below -->
<script lang="ts">
  import IpfsImage from "../../../../libs/o-views/atoms/IpfsImage.svelte";
  import {ProfilesDocument} from "omo-central/dist/generated";
  import {query} from "svelte-apollo";
  import {setClient} from "svelte-apollo";
  import DataField from "../../../_generic/views/atoms/DataField.svelte";
  import {RunProcess} from "omo-process/dist/events/runProcess";
  import {shellProcess, ShellProcessContext} from "../../../../dapps/identity/processes/shell/shellProcess";
  import {upsertProfile} from "../../../../dapps/identity/processes/upsertProfile/upsertProfile";
  import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
  import {
    faEdit
  } from "@fortawesome/free-solid-svg-icons";

  export let fissionName: string;
  export let client: any;

  setClient(client);
  $:profiles = query(ProfilesDocument, {
    variables: {
      "query": {
        "fissionName": fissionName
      }
    }
  });

  function edit(
    firstName:boolean,
    lastName:boolean,
    avatar:boolean
  ) {
    const data:{
      firstName: ProcessArtifact,
      lastName: ProcessArtifact,
      avatarCid: ProcessArtifact,
      avatarMimeType: ProcessArtifact
    } = {};
    if (!firstName) {
      data.firstName = <ProcessArtifact>{
        type: "text",
        key: "firstName",
        value: $profiles.data.profiles[0].omoFirstName
      }
    }
    if (!lastName) {
      data.lastName = <ProcessArtifact>{
        type: "text",
        key: "lastName",
        value: $profiles.data.profiles[0].omoLastName
      }
    }
    if (!avatar) {
      data.avatarCid = <ProcessArtifact>{
        type: "text",
        key: "avatarCid",
        value: $profiles.data.profiles[0].omoAvatarCid
      }
      data.avatarMimeType = <ProcessArtifact>{
        type: "text",
        key: "avatarMimeType",
        value: $profiles.data.profiles[0].omoAvatarMimeType
      }
    }
    const event = new RunProcess<ShellProcessContext>(shellProcess, async ctx => {
      ctx.childProcessDefinition = upsertProfile;
      ctx.childContext = {
        environment: {},
        data: data
      }
      return ctx;
    });
    window.o.publishEvent(event);
  }

  const editFirstName = {
    icon: faEdit,
    title: "Edit",
    action: () => edit(true, false, false)
  };
  const editLastName = {
    icon: faEdit,
    title: "Edit",
    action: () => edit(false, true, false)
  };
  const editAvatar = {
    icon: faEdit,
    title: "Edit",
    action: () => edit(false, false, true)
  };

  console.log("actions:", editFirstName, editLastName, editAvatar)

</script>
{#if $profiles.loading}
  Loading profiles...
{:else if $profiles.error}
  <b>An error occurred while loading the profiles:</b> <br/>{$profiles.error.message}
{:else if $profiles.data && $profiles.data.profiles && $profiles.data.profiles.length > 0}
  {#each $profiles.data.profiles as profile}
    <div>
      <div class="px-4 py-6 text-xl text-center bg-white border md:mt-4 md:py-10 rounded-xl text-primary border-light-200">
        <div on:click={() => editAvatar.action()}>
          <IpfsImage cid={profile.omoAvatarCid} mimeType={profile.omoAvatarMimeType}
                     classes="w-40 h-40 mx-auto bg-white border-4 rounded-full md:w-48 md:h-48 border-light-300"/>
        </div>
      </div>
      <div class="pt-2 space-y-2">
        <DataField
          mapping={{ data: { title: profile.omoFirstName, subtitle: 'first name' } }} actions={[editFirstName]}/>
        {#if profile.omoLastName}
          <DataField
            mapping={{ data: { title: profile.omoLastName, subtitle: 'last name' } }} actions={[editLastName]}/>
        {/if}
      </div>
    </div>
  {/each}
{:else}
  <span>Not found</span>
{/if}