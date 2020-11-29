<script lang="ts">
  import Friends from "../molecules/Friends.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";
  let header = {
    data: {
      title: "Friends",
    },
  };

  let address = localStorage.getItem("omo.safeAddress");
</script>

<Compose rows="1fr" columns="1fr" overflowY tw="m-4 md:m-0">
  <Friends {address} />
</Compose>
