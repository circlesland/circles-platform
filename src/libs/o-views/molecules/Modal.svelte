<script lang="ts">
  // imports
  import { afterUpdate, createEventDispatcher } from "svelte";
  import { fade, scale, fly } from "svelte/transition";
  import ProgressBar from "../atoms/ProgressBar.svelte";
  import InfoBox from "./InfoBox.svelte";

  const dispatch = createEventDispatcher();
  // public props
  // export let triggerRef = undefined;
  export let isOpen = false;
  export let role = "dialog";
  // local props
  let buttonRef;
  // functions
  const handleClose = () => {
    dispatch("closeRequest");
  };
  const handleEsc = (e) => e.key === "Escape" && handleClose();
  let progressSeries: number[] = [33, 66, 100];
</script>

<style>
  * {
    box-sizing: border-box;
  }
  aside {
    /* z-index: 1000; */
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    overflow-y: hidden;
  }
</style>

{#if isOpen}
  <aside
    on:keydown={handleEsc}
    aria-labelledby="modal-heading"
    aria-modal="true"
    tabIndex={-1}
    {role}
    in:fade
    out:fade
    on:click|self={handleClose}
    class="z-40 overlay ">
    <div class="w-full max-w-3xl bg-white rounded-t-xl md:rounded-xl">
      <InfoBox />
      <div class="p-4 space-y-2 md:p-8">
        <slot />
      </div>
    </div>
  </aside>
{/if}
