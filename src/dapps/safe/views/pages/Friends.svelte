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

<Compose rows="50px 1fr" columns="1fr">
  <Compose>
    <Header mapping={header} />
  </Compose>
  <Compose rows="1fr" columns="1fr" tw="px-4" overflowY>
    <Friends {address} />
  </Compose>
</Compose>
