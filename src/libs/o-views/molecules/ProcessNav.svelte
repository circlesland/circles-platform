<script lang="ts">
  import { faTimes } from "@fortawesome/free-solid-svg-icons";
  import Compose from "../atoms/Compose.svelte";
  import NavItem from "../atoms/NavItem.svelte";

  export let isOpen: boolean;

  const close = {
    data: {
      label: "Close",
    },
    design: {
      icon: faTimes,
    },
  };
</script>

<Compose tw="mx-auto text-gray-400 mt-5">
  <div
    on:click={() => {
      isOpen = false;
    }}>
    <NavItem mapping={close} />
  </div>
</Compose>
