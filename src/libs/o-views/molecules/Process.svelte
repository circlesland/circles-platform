<script lang="ts">
  import type {Process} from "../../../main";
  import Prompt from "./Prompt.svelte";
  import {Prompt as PromptEvent, PromptField} from "../../o-events/prompt";
  import {createEventDispatcher} from "svelte";
  import {Jumper} from "svelte-loading-spinners";
  import {faArrowLeft, faTimes} from "@fortawesome/free-solid-svg-icons";
  import NavItem from "../atoms/NavItem.svelte";
  import {Trigger} from "../../o-events/trigger";
  import {Back} from "../../o-events/back";
  import {Cancel} from "../../o-events/cancel";

  export let process: Process;

  let fields:PromptField[] = [];

  const dispatch = createEventDispatcher();

  $: {
    if (process)
    {
      subscribeToProcess(process);
      process.sendEvent(new Trigger());
    }
  }

  function subscribeToProcess(process: Process)
  {
    process.events.subscribe((next) =>
    {
      if (next.event?.type === "omo.prompt")
      {
        let prompt = <PromptEvent>next.event;
        fields = prompt.fields;
      }
      else if (next.stopped)
      {
        dispatch("stopped");
        process = null;
      }
    });
  }

  const handleBack = () =>
  {
    const runningProcess = window.stateMachines.current();
    if (!runningProcess)
    {
      return;
    }
    runningProcess.sendEvent(new Back());
  };

  const handleCancel = () =>
  {
    const runningProcess = window.stateMachines.current();
    if (!runningProcess)
    {
      return;
    }
    runningProcess.sendEvent(new Cancel());
  };
</script>

<div class="w-full">
  <Prompt process={process} fields={fields} />
</div>

<footer class="flex justify-between px-4 pb-2 text-gray-400 bg-white ">
  <button on:click={handleBack}>
    <NavItem icon={faArrowLeft} text="Back"/>
  </button>
  <button on:click={handleCancel}>
    <NavItem icon={faTimes} text="Close"/>
  </button>
  <button on:click={() => {}}>
    <div
      class="flex items-center justify-center w-16 px-2 text-xs text-center hover:text-secondary-lighter">
      <span>
        <i class="text-2xl"/>
        <p class="lowercase font-title"/>
      </span>
    </div>
  </button>
</footer>
