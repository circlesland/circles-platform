<script lang="ts">
  import type { Process } from "../../../main";
  import { PromptField } from "../../o-processes/processEvent";
  import { ProcessDefinition } from "../../o-processes/processManifest";
  import Prompt from "./Prompt.svelte";
  import { ProcessContext } from "../../o-processes/processContext";
  import { createEventDispatcher } from "svelte";
  import { Jumper } from "svelte-loading-spinners";
  import { faArrowLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
  import NavItem from "../atoms/NavItem.svelte";

  let statusType: "none" | "message" | "notification" | "prompt" = "none";
  let status: string = "";

  let promptId: string = "";
  let promptFields: { key: string; field: PromptField }[] = [];

  export let definition: ProcessDefinition;
  export let process: Process;
  export let contextInitializer: (
    processContext: ProcessContext
  ) => ProcessContext;

  const dispatch = createEventDispatcher();

  $: {
    if (process) {
      subscribeToProcess(process);

      process.sendEvent(<ProcessEvent>{
        type: "omo.trigger",
      });
    } else if (definition) {
      process = window.stateMachines.run(definition, contextInitializer);

      subscribeToProcess(process);

      process.sendEvent(<ProcessEvent>{
        type: "omo.trigger",
      });
    }
  }

  function subscribeToProcess(process: Process) {
    process.events.subscribe((next) => {
      if (next.event?.type === "omo.notification") {
        statusType = "notification";
        status = next.event.message;
      } else if (next.event?.type === "omo.prompt") {
        statusType = "prompt";
        status = next.event.message;
        promptId = next.event.data.id;
        promptFields = Object.keys(next.event.data.fields).map((key) => {
          return {
            key: key,
            field: next.event.data.fields[key],
          };
        });
      } else if (next.event?.type === "omo.continue") {
        statusType = "message";
        status = next.event.message ?? "Continue";
      } else if (next.stopped) {
        dispatch("stopped");
        process = null;
      }
    });
  }

  const handleBack = () => {
    const runningProcess = window.stateMachines.current();
    if (!runningProcess) {
      return;
    }
    console.log("Going one step back.");
    runningProcess.sendEvent({
      type: "omo.back",
    });
  };
  const handleCancel = () => {
    const runningProcess = window.stateMachines.current();
    if (!runningProcess) {
      return;
    }
    runningProcess.sendEvent({
      type: "omo.cancel",
    });
  };

  const back = {
    data: {
      label: "Back",
    },
    design: {
      icon: faArrowLeft,
    },
  };

  const cancel = {
    data: {
      label: "Cancel",
    },
    design: {
      icon: faTimes,
    },
  };
</script>

<div class="w-full">
  {#if process}
    {#if statusType === 'message'}
      <h1 class="px-4 py-8 mb-4 text-center rounded text-primary bg-light-100">
        {status}
      </h1>
    {:else if statusType === 'notification'}
      <div class="flex items-center justify-center mx-auto">
        <Jumper size="60" color="#0C266A" unit="px" />
      </div>
      <h1 class="px-4 py-8 mb-4 text-center bg-white rounded text-primary">
        {status}
      </h1>
    {:else if statusType === 'prompt'}
      <Prompt {status} {process} {promptFields} {promptId} />
    {/if}
  {:else}
    <h1>Process ended</h1>
  {/if}
</div>

<footer class="flex justify-between px-4 pb-2 text-gray-400 bg-white ">
  <button on:click={handleBack}>
    <NavItem mapping={back} />
  </button>
  <button on:click={handleCancel}>
    <NavItem mapping={cancel} />
  </button>
  <button on:click={() => {}}>
    <div
      class="flex items-center justify-center w-16 px-2 text-xs text-center hover:text-secondary-lighter">
      <span>
        <i class="text-2xl" />
        <p class="lowercase font-title" />
      </span>
    </div>
  </button>
</footer>
