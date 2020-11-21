<script lang="ts">
  import Button from "src/libs/o-views/atoms/Button.svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import { onMount } from "svelte";
  import * as wn from "webnative";

  let state;
  let appFolders;
  let a = [];
  let path;

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
    path = appPath;

    // await fs.mkdir(fs.appPath(["Test2"]));
    // await fs.publish();

    const content = "hello omo2";
    const updatedCID = await fs.add(fs.appPath("hola2", content));
    await fs.publish();

    // const objectArray = Object.entries(appFolders);

    // objectArray.forEach(([key, value]) => {
    //   console.log("descructured: ", { key: value });
    // });

    // a = Object.entries(await appFolders);

    // a = await Object.keys(appFolders);
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
        <!-- <div>List of my apps:</div> -->
      </div>
    {/if}

    <div class="p-2"><span class="font-bold">-- ipfs --</span></div>
    {#if state != undefined}
      <div>{path}</div>
      <!-- <div class="max-w-2xl break-all text-xxs">
        {#each a as a}{JSON.stringify(a)}{/each}
      </div> -->

      <!-- {#each a as [key, value]}
        <div>
          {key}:
          {#if value.isFile}
            {JSON.stringify(value)}
          {:else}{JSON.stringify(value)}{/if}
        </div>
      {/each} -->
    {/if}
  </div>
</div>
