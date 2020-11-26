<script lang="ts">
  import Compose from "../atoms/Compose.svelte";

  export let data = {
    title: "title",
  };
  export let address: string = "";
</script>

<Compose
  columns="auto 1fr auto"
  rows="1fr"
  tw="text-white lowercase bg-primary">
  <div class="flex items-center justify-center" />
  <div
    class="flex items-center justify-center pt-1 text-xl font-bold text-center ">
    {data.title}
  </div>
  <div class="flex items-center justify-center">
    <!-- <img
      src="https://avatars.dicebear.com/api/avataaars/{address}.svg"
      alt="home" /> -->
  </div>
</Compose>
