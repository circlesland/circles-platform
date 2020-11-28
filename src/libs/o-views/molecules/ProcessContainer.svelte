<script lang="ts">
  import NavItem from "../atoms/NavItem.svelte";
  import {Process} from "../../o-processes/interfaces/process"
  import {faArrowLeft, faArrowRight, faTimes} from "@fortawesome/free-solid-svg-icons";
  import {Back} from "../../o-processes/events/back";
  import {Cancel} from "../../o-processes/events/cancel";
  import Prompt from "./Prompt.svelte";
  import {Prompt as PromptEvent} from "../../o-processes/events/prompt";
  import {Continue} from "../../o-processes/events/continue";
  import {createEventDispatcher} from "svelte";
  import {Subscription} from "rxjs";

  /**
   * A channel to an already running process.
   */
  export let process: Process;

  let subscription:Subscription;
  let canSkip = false;
  let prompt:PromptEvent;

  const dispatch = createEventDispatcher();

  $:{
    let initial = !subscription;
    if (subscription) {
      console.log("unsubscribe()");
      subscription.unsubscribe();
      subscription = null;
    }
    if(process) {
      console.log("subscribeToProcess()");
      subscribeToProcess();
      console.log("subscription:", subscription);
    } else {
      console.log("clear");
      canSkip = false;
      prompt = null;
    }
    if (initial && process){
      process.sendEvent(new Continue());
    }
  }

  function ensureProcess(action: (p: Process) => void) {
    if (!process) {
      console.warn("ProcessContainer.svelte: No running 'process' attached to ProcessContainer.");
      return;
    }
    action(process);
  }

  function subscribeToProcess()
  {
    ensureProcess(process => {
      subscription = process.events.subscribe((next) =>
      {
        if (next.event?.type === "process.prompt")
        {
          prompt = <PromptEvent>next.event;
          let artifactsArr = Object.keys(prompt.data)
            .map(key => prompt.data[key]);

          canSkip = artifactsArr.length === 0
            || artifactsArr.filter(artifact => artifact.isOptional).length === artifactsArr.length;
        }
        else if (next.stopped)
        {
          console.log("stopped:", next);

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
  const backPressed = () => ensureProcess(p => p.sendEvent(new Back()));

  const cancel = {
    data: {
      label: "Cancel",
    },
    design: {
      icon: faTimes,
    },
  };
  const cancelPressed = () => ensureProcess(p => p.sendEvent(new Cancel()));

  const skip = {
    data: {
      label: "Skip",
    },
    design: {
      icon: faArrowRight,
    },
  };
  const skipPressed = () => ensureProcess(p => p.sendEvent(new Continue()));

</script>

{#if process && prompt}
  {#if prompt.title}
    <header class="rounded-t-lg">
      <div
        class="flex items-center justify-center py-2 overflow-hidden text-base text-center text-white rounded-t-xl bg-primary">
        <div class="flex items-center justify-between lowercase font-title">
          {prompt.title}
        </div>
      </div>
      <!-- <ProgressBar /> -->
    </header>
  {/if}
  <div class="w-full">
    <Prompt process={process} prompt={prompt} />
  </div>
{/if}
<footer class="flex justify-between px-4 pb-2 text-gray-400 bg-white ">
  <button on:click={backPressed}>
    <NavItem mapping={back}/>
  </button>
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
