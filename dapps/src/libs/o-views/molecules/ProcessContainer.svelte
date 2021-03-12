<script lang="ts">
  import NavItem from "../atoms/NavItem.svelte";
  import {
    faArrowLeft,
    faForward,
    faTimes,
  } from "@fortawesome/free-solid-svg-icons";
  import Prompt from "./Prompt.svelte";
  import { createEventDispatcher } from "svelte";
  import {Process} from "omo-process/dist/interfaces/process";
  import {ShellEvent} from "omo-process/dist/events/shellEvent";
  import {Back} from "omo-process/dist/events/back";
  import {Cancel} from "omo-process/dist/events/cancel";
  import {Prompt as PromptEvent} from "omo-process/dist/events/prompt";
  import {Continue} from "omo-process/dist/events/continue";
  import {OmoSubscription} from "omo-quirks/dist/OmoSubscription";
  import {OmoEvent} from "omo-events/dist/omoEvent";
  import {Bubble} from "../../../dapps/identity/events/process/ipc/bubble";

  /**
   * A channel to an already running process.
   */
  export let process: Process;

  let subscription: OmoSubscription;
  let canSkip = false;
  let canGoBack = false;
  let prompt: PromptEvent;

  const dispatch = createEventDispatcher();

  $: {
    if (subscription) {
      console.log("unsubscribe()");
      subscription.unsubscribe();
      subscription = null;
    }
    if (process) {
      console.log("subscribeToProcess()");
      subscribeToProcess();
      console.log("subscription:", subscription);
    } else {
      console.log("clear");
      canSkip = false;
      prompt = null;
    }
  }

  let lastBubble:Bubble;

  function ensureProcess(action: (p: Process) => void) {
    if (!process) {
      console.warn(
        "ProcessContainer.svelte: No running 'process' attached to ProcessContainer."
      );
      return;
    }
    action(process);
  }

  function subscribeToProcess() {

    ensureProcess((process) =>
    {
      subscription = process.events.subscribe((next) =>
      {
        if (next.stopped) {
          prompt = null;
          process = null;
          dispatch("stopped");
        }

        if (!next.event)
          return;

        console.log("ProcessContainer received: ", next.event);

        let event:OmoEvent;
        if (next.event?.type === "process.ipc.bubble") {
          console.log("ProcessContainer received Bubble: ", next);
          lastBubble = next.event;
          event = next.event.wrappedEvent;
        } else {
          event = next.event;
        }

        if (event.type === "process.shellEvent")
        {
          console.log("ProcessContainer received 'process.shellEvent' event: ", next);
          console.log("publishing shell event:", event);
          window.o.publishEvent((<ShellEvent>event).payload);
        }
        else if (event.type === "process.prompt")
        {
          console.log("ProcessContainer received 'process.prompt' event: ", next);
          prompt = <PromptEvent>event;
          let artifactsArr = Object.keys(prompt.data).map(
            (key) => prompt.data[key]
          );

          canSkip =
            artifactsArr.length > 0 &&
            artifactsArr.filter((artifact) => artifact.isOptional).length ===
              artifactsArr.length;

          console.log("canSkip:", canSkip);
          console.log("artifactsArr:", artifactsArr);

          canGoBack = prompt.canGoBack;
        }
      });

      process.sendEvent({
        type: "process.continue",
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
        class="flex items-center justify-between text-xl font-bold text-center lowercase text-primary">
        {prompt.title}
      </div>
    </div>
  {/if}
  <div class="w-full">
    <Prompt {process} {prompt} bubble={lastBubble} />
  </div>
{/if}
<footer class="flex justify-between px-4 pt-4 text-gray-400 bg-white ">
  {#if canGoBack}
    <button on:click={backPressed}>
      <NavItem mapping={back} />
    </button>
  {:else}
    <button on:click={() => {}}>
      <div
        class="flex items-center justify-center w-16 px-2 text-xs text-center hover:text-secondary-lighter">
        <span>
          <i class="text-2xl" />
          <p class="lowercase " />
        </span>
      </div>
    </button>
  {/if}
  <button on:click={cancelPressed}>
    <NavItem mapping={cancel} />
  </button>
  {#if !canSkip}
    <button on:click={() => {}}>
      <div
        class="flex items-center justify-center w-16 px-2 text-xs text-center hover:text-secondary-lighter">
        <span>
          <i class="text-2xl" />
          <p class="lowercase " />
        </span>
      </div>
    </button>
  {:else}
    <button on:click={skipPressed}>
      <NavItem mapping={skip} />
    </button>
  {/if}
</footer>
