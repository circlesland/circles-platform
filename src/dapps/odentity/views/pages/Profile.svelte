<script lang="ts">
  import Button from "src/libs/o-views/atoms/Button.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import { Jumper } from "svelte-loading-spinners";
  import { onMount } from "svelte";
  import { buttonLogin, title } from "./../../data/profile";

  const wn = window.wn;

  let state;
  let appFolders = [];
  let path;
  let fs: any;

  let myApps;

  let authState;

  onMount(async () => {
    await initAuth();
    await initFS();
    await listApps();
  });

  async function initAuth() {
    state = await wn.initialise({
      permissions: {
        // Will ask the user permission to store
        // your apps data in `private/Apps/{creator}}/{name}`
        app: {
          name: "OmoTest",
          creator: "MamaOmo",
        },
      },
    });
    switch (state.scenario) {
      case wn.Scenario.AuthCancelled:
        authState = "you cancelled the access authorisation";
        break;

      case wn.Scenario.AuthSucceeded:
      case wn.Scenario.Continuation:
        authState = "you authenticated successfully";
        // State:
        // state.authenticated    -  Will always be `true` in these scenarios
        // state.newUser          -  If the user is new to Fission
        // state.throughLobby     -  If the user authenticated through the lobby, or just came back.
        // state.username         -  The user's username.
        //
        // ☞ We can now interact with our file system (more on that later)
        state.fs;
        break;

      case wn.Scenario.NotAuthorised:
        authState = "you are not authorized, please allow access";
        wn.redirectToLobby(state.permissions);
        break;
    }
  }
  async function initFS() {
    fs = state.fs;
    const appPath = fs.appPath();
    if (await fs.exists(appPath)) {
      await fs.ls(appPath);
      console.log("before create:", fs.ls(appPath));
    } else {
      await fs.mkdir(appPath);
      await fs.publish();
    }
    console.log("fs ls root path:", await fs.ls(appPath));
    path = appPath;

    await updateDirectoryList();
  }

  async function listApps() {
    const a = await wn.apps.index();
    myApps = Object.values(a)[0];
    console.log("my apps:", myApps);
  }

  async function updateDirectoryList() {
    const list = await fs.ls(fs.appPath());
    appFolders = [];
    Object.keys(list).forEach(function (key) {
      appFolders.push(list[key]);
    });
  }

  let openDetail: boolean = false;

  function toggleExpand() {
    openDetail = !openDetail;
  }

  function fissionAuth() {
    wn.redirectToLobby(state.permissions);
  }
</script>

<style>
  .card {
    display: grid;
    grid-template-columns: 3.5rem 1fr 1fr;
    grid-template-rows: 3.5rem;
    max-width: 100%;
  }
</style>

<Compose rows="auto 1fr" columns="1fr">
  <Compose tw="h-14">
    <Header mapping={title} />
  </Compose>

  <Compose tw="p-4" gap="10px" overflowY>
    <div>
      {#if authState == undefined}
        <div class="flex items-center justify-center h-full mx-auto">
          <div>
            <Jumper size="150" color="#071D69" unit="px" /><br />
            <div class="text-sm text-center lowercase text-primary">
              authenticating<br />
            </div>
          </div>
        </div>
      {:else}
        {#if state != undefined && !state.authenticated}
          <div on:click={fissionAuth}>
            <Button mapping={buttonLogin} />
          </div>
        {/if}

        {#if state != undefined}
          <div class="">
            <div
              class="px-4 py-12 text-xl text-center bg-white border rounded text-primary border-light-200 font-title">
              Welcome,
              {state.username}<br />
              <span class="text-sm text-light-500">{authState}</span>
            </div>
          </div>
          <div class="p-2">
            <!-- 
            <div>Scenario:  {state.scenario}</div>
            <div>AppName: {state.permissions.app.name}</div>
            <div>AppCreator: {state.permissions.app.creator}</div>
            <div>Authenticated: {state.authenticated}</div> 
          -->
          </div>
        {/if}
      {/if}

      <!-- <div class="p-2">
        <span class="font-bold">-- ipfs --</span>
        {#if state != undefined}
          <div>App path: {path}</div>
          <div>Data in my app:</div>

          <div class="space-y-2 ">
            {#each appFolders as data}
              <div
                on:click={toggleExpand}
                class="w-full bg-white border rounded card border-light-200">
                <div class="flex items-center justify-center p-2">
                  {#if data.isFile}FILE{:else}DIR{/if}
                </div>
                <div class="px-1 py-2">
                  <div class="text-base text-primary">{data.name}</div>
                  <p class="text-xs text-gray-500">
                    <span class="text-xs text-gray-500">{data.mtime}</span>
                  </p>
                </div>
                <div class="p-1 px-4 text-right">
                  <div class="py-1 text-3xl font-light text-action">
                    {data.size}
                  </div>
                </div>
              </div>
              {#if data.pointer && openDetail}
                <div
                  class="w-full p-2 text-xs text-gray-500 bg-white border-b border-l border-r border-light-200">
                  Address:
                  <span class="text-primary">{data.pointer}</span>
                </div>
              {/if}
            {/each}
          </div>
        {/if}
      </div>-->
    </div>
  </Compose>
</Compose>
