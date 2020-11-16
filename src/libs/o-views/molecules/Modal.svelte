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
    <div class="w-full max-w-lg bg-white rounded-t-lg">
      <header class="rounded-t-lg">
        <div class="flex text-white text-center text-xl overflow-hidden text-xs rounded-t-lg bg-primary">
          <h1>Process title</h1>
        </div>
        <!-- Optional stepper -->
        <div class="flex overflow-hidden text-xs rounded-t-lg text-primary">
          <p class="p-4">
            Step 1
          </p>
          <p class="p-4">
            Step 2
          </p>
          <p class="p-4">
            Step 3
          </p>
        </div>
      </header>
      <div style="padding-bottom: 1rem">
        <slot>No content provided</slot>
        <div class="w-full flex ">
          <div
                  aria-label="Close modal"
                  bind:this={buttonRef}
                  on:click={handleClose}
                  class="w-full mx-auto text-center text-light-400 ">
            <i class="my-2 text-4xl fas fa-arrow-left " />
          </div>
          <div
                  aria-label="Close modal"
                  bind:this={buttonRef}
                  on:click={handleClose}
                  class="w-full mx-auto text-center text-light-400 ">
            <i class="my-2 text-4xl fas fa-times-circle " />
          </div>
          <div aria-label="Close modal"
                  bind:this={buttonRef}
                  on:click={handleClose}
                  class="w-full mx-auto text-center text-light-400 ">
            <!--<i class="my-2 text-4xl fas fa-arrow-right " />-->
          </div>
        </div>
      </div>
    </div>
  </aside>
{/if}
