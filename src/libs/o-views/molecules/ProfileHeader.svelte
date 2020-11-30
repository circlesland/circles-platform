<script lang="ts">
  import Avataaar from "../atoms/Avataaar.svelte";
  import { ProfileHeader } from "./../interfaces/molecules";

  export let mapping: ProfileHeader;

  let avataar = {
    data: {
      seed: mapping.data.image,
    },
    design: {
      radius: 100,
    },
  };
</script>

<div
  class="flex items-center justify-center font-bold text-center text-white bg-primary lg:rounded-xl">
  <div>
    {#if mapping.data.image}
      <div
        class="w-32 h-32 mx-auto mt-4 bg-white border-4 rounded-full border-light-300">
        <Avataaar mapping={avataar} />
      </div>
      <!-- <img
        src={data.image}
        class="w-32 h-32 mx-auto mt-4 bg-white border-4 rounded-full border-light-300"
        alt="img" /> -->
    {/if}
    <div class="py-4 mt-2 font-bold">
      <div class="text-2xl">{mapping.data.subtitle}</div>
    </div>
  </div>
</div>
