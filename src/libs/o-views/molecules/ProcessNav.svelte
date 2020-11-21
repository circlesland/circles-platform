<script lang="ts">
  import { faTimes } from "@fortawesome/free-solid-svg-icons";
  import Compose from "../atoms/Compose.svelte";
  import NavItem from "../atoms/NavItem.svelte";

  export let isOpen: boolean;
</script>

<Compose tw="mx-auto text-gray-500 mt-2">
  <div
    on:click={() => {
      isOpen = false;
    }}>
    <NavItem icon={faTimes} text="close" />
  </div>
</Compose>
