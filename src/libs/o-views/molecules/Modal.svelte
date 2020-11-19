<script lang="ts">
  // imports
  import {afterUpdate, createEventDispatcher} from "svelte";
  import { fade, scale, fly } from "svelte/transition";
  import ProgressBar from "../atoms/ProgressBar.svelte";

  const dispatch = createEventDispatcher();
  // public props
  export let triggerRef = undefined;
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
    class="z-40 overlay">
    <div class="w-full max-w-lg bg-white rounded-t-xl">
      <header class="rounded-t-lg">
        <div
          class="flex items-center justify-center py-2 overflow-hidden text-base text-center text-white rounded-t-xl bg-primary">
          <div class="flex items-center justify-between lowercase font-title">
            -- step title --
          </div>
        </div>
        <ProgressBar />
      </header>
      <slot></slot>
    </div>
  </aside>
{/if}
