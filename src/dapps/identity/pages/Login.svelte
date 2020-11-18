<script lang="ts">
  import Button from "src/libs/o-views/atoms/Button.svelte";
  import Folder from "src/libs/o-views/atoms/Folder.svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import TemplateMobileWrapper from "src/libs/o-views/templates/TemplateMobileWrapper.svelte";
  import { onMount } from "svelte";
  import * as wn from "webnative";

  let state;
  let appFolders;
  let a = [];

  async function init() {
    state = await wn.initialise({
      permissions: {
        // Will ask the user permission to store
        // your apps data in `private/Apps/Nullsoft/Winamp`
        app: {
          name: "OmoTest",
          creator: "MamaOmo",
        },
      },
    });
    if (!state.authenticated) {
      wn.redirectToLobby(state.permissions);
    }
    const fs = state.fs;
    const appPath = fs.appPath();
    if (await fs.exists(appPath)) {
      await fs.ls(appPath);
      console.log("before create:", fs.ls(appPath));
    } else {
      await fs.mkdir(appPath);
      await fs.publish();
    }
    console.log("fs ls app path:", await fs.ls(appPath));
    appFolders = await fs.ls(appPath);
    console.log("app path:", appPath);

    // appFolders = await fs.ls(appPath);
    // await fs.mkdir(fs.appPath(["Test2"]));
    // await fs.publish();
    // console.log("list app route folder:", appPath);

    const content = "hello omo2";
    const updatedCID = await fs.add(fs.appPath("hola2", content));
    await fs.publish();

    a = Object.entries(await appFolders);
  }

  function login() {
    if (state.authenticated) {
      alert("you are already authenticated");
    } else {
      wn.redirectToLobby(state.permissions);
    }
  }

  onMount(async () => {
    await init();
  });

  let title = { title: "Omo Test App by Mama Omo" };
</script>

<TemplateMobileWrapper>
  <div class="bg-white">
    <div class="h-14">
      <Header data={title} />
    </div>
    <div class="p-4">
      {#if state == undefined}
        <div on:click={login}>
          <Button text="login" type="primary" />
        </div>
      {/if}
      <span class="p-2 font-bold">-- authentication --</span>

      {#if state != undefined}
        <div class="p-2">
          <div>Scenario: {state.scenario}</div>
          <div>UserName: {state.username}</div>
          <div>AppName: {state.permissions.app.name}</div>
          <div>AppCreator: {state.permissions.app.creator}</div>
          <div>Authenticated: {state.authenticated}</div>
          <div>Auth Through Lobby: {state.throughLobby}</div>
          <div>New User: {state.newUser}</div>
          <div>List of my apps:</div>
        </div>
      {/if}

      <div class="p-2"><span class="font-bold">-- ipfs --</span></div>
      {#if state != undefined}
        <!-- {JSON.stringify(a)} -->

        {#each a as [key, value]}
          <div>
            {key}:
            {#if value.isFile}
              {JSON.stringify(value)}
            {:else}{JSON.stringify(value)}{/if}
            <!-- {JSON.stringify(value)} -->
          </div>
          <!-- {#if file.type === 'folder'}
              <svelte:self {...file} />
            {:else}
              <File {...file} />
            {/if} -->
        {/each}

        <!-- {#each a as [key, value]}{key}-{value}{/each} -->

        <!-- <Folder name="App" files={root} expanded />
        -->
      {/if}
      <!-- <div class="py-8 ">
        <Folder name="Home" files={root} expanded />
      </div> -->
    </div>
  </div>
</TemplateMobileWrapper>
