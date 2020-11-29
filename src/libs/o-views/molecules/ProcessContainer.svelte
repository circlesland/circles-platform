<script lang="ts">
  import NavItem from "../atoms/NavItem.svelte";
  import {Process} from "../../o-processes/interfaces/process";
  import {
    faArrowLeft,
    faForward,
    faTimes,
  } from "@fortawesome/free-solid-svg-icons";
  import {Back} from "../../o-processes/events/back";
  import {Cancel} from "../../o-processes/events/cancel";
  import Prompt from "./Prompt.svelte";
  import {Prompt as PromptEvent} from "../../o-processes/events/prompt";
  import {Continue} from "../../o-processes/events/continue";
  import {createEventDispatcher} from "svelte";
  import {Subscription} from "rxjs";
  import {ShellEvent} from "../../o-processes/events/shellEvent";

  /**
   * A channel to an already running process.
   */
  export let process: Process;

  let subscription: Subscription;
  let canSkip = false;
  let canGoBack = false;
  let prompt: PromptEvent;

  const dispatch = createEventDispatcher();

  $: {
    let initial = !subscription;
    if (subscription)
    {
      console.log("unsubscribe()");
      subscription.unsubscribe();
      subscription = null;
    }
    if (process)
    {
      console.log("subscribeToProcess()");
      subscribeToProcess();
      console.log("subscription:", subscription);
    }
    else
    {
      console.log("clear");
      canSkip = false;
      prompt = null;
    }
  }

  function ensureProcess(action: (p: Process) => void)
  {
    if (!process)
    {
      console.warn(
        "ProcessContainer.svelte: No running 'process' attached to ProcessContainer."
      );
      return;
    }
    action(process);
  }

  function subscribeToProcess()
  {
    ensureProcess((process) =>
    {
      subscription = process.events.subscribe((next) =>
      {
        if (next.event?.type === "process.shellEvent")
        {
          window.o.dispatchShellEvent((<ShellEvent>next.event).payload)
        }
        else if (next.event?.type === "process.prompt")
        {
          prompt = <PromptEvent>next.event;
          let artifactsArr = Object.keys(prompt.data).map(
            (key) => prompt.data[key]
          );

          canSkip = artifactsArr.length > 0
            && artifactsArr.filter((artifact) => artifact.isOptional).length === artifactsArr.length;

          canGoBack = prompt.canGoBack;
        }
        else if (next.stopped)
        {
          prompt = null;
          process = null;
          dispatch("stopped");
        }
      });
    });
  }

  const back = {
    data: {
      label: "Back",
    },
    design: {
      icon: faArrowLeft,
    },
  };
  const backPressed = () => ensureProcess((p) => p.sendEvent(new Back()));

  const cancel = {
    data: {
      label: "Cancel",
    },
    design: {
      icon: faTimes,
    },
  };
  const cancelPressed = () => ensureProcess((p) => p.sendEvent(new Cancel()));

  const skip = {
    data: {
      label: "Skip",
    },
    design: {
      icon: faForward,
    },
  };
  const skipPressed = () => ensureProcess((p) => p.sendEvent(new Continue()));
</script>

{#if process && prompt}
  {#if prompt.title}
    <div class="flex items-center justify-center overflow-hidden ">
      <div
        class="flex items-center justify-between text-xl font-bold text-center lowercase font-title text-primary">
        {prompt.title}
      </div>
    </div>
  {/if}
  <div class="w-full">
    <Prompt {process} {prompt}/>
  </div>
{/if}
<footer class="flex justify-between px-4 pt-4 text-gray-400 bg-white ">
  {#if canGoBack}
    <button on:click={backPressed}>
      <NavItem mapping={back}/>
    </button>
  {:else}
    <button on:click={() => {}}>
      <div
        class="flex items-center justify-center w-16 px-2 text-xs text-center hover:text-secondary-lighter">
        <span>
          <i class="text-2xl"/>
          <p class="lowercase font-title"/>
        </span>
      </div>
    </button>
  {/if}
  <button on:click={cancelPressed}>
    <NavItem mapping={cancel}/>
  </button>
  {#if !canSkip}
    <button on:click={() => {}}>
      <div
        class="flex items-center justify-center w-16 px-2 text-xs text-center hover:text-secondary-lighter">
        <span>
          <i class="text-2xl"/>
          <p class="lowercase font-title"/>
        </span>
      </div>
    </button>
  {:else}
    <button on:click={skipPressed}>
      <NavItem mapping={skip}/>
    </button>
  {/if}
</footer>
