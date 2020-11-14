<script>
  // imports
  import { afterUpdate } from "svelte";
  import { fade, scale, fly } from "svelte/transition";
  // public props
  export let triggerRef = undefined;
  export let isOpen = false;
  export let role = "dialog";
  // local props
  let buttonRef;
  // functions
  const handleClose = () => (isOpen = false);
  const handleEsc = (e) => e.key === "Escape" && handleClose();
  // lifecycle
  afterUpdate(() => {
    if (isOpen) {
      buttonRef.focus();
    } else {
      triggerRef && triggerRef.focus();
    }
  });
</script>

<style>
  * {
    box-sizing: border-box;
  }
  aside {
    z-index: 1000;
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
    class="overlay">
    <div class="w-full max-w-lg bg-white rounded-t-lg">
      <header class="rounded-t-lg">
        <div class="flex h-3 overflow-hidden text-xs rounded-t-lg bg-primary" />
        <div
          aria-label="Close modal"
          bind:this={buttonRef}
          on:click={handleClose} />
      </header>
      <div style="padding-bottom: 5rem">
        <slot>No content provided</slot>
      </div>
    </div>
  </aside>
{/if}
