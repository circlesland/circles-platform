<script lang="ts">
  import { faMinus } from "@fortawesome/free-solid-svg-icons";
  import ButtonIcon from "../atoms/ButtonIcon.svelte";
  import { KeyItem } from "./../interfaces/molecules";

  export let mapping: KeyItem;

  const removeAccess = {
    design: {
      icon: faMinus,
      type: "light-danger",
    },
  };

  let openDetail: boolean = false;

  function toggleExpand() {
    openDetail = !openDetail;
  }
</script>

<style>
  .card {
    display: grid;
    grid-template-columns: 3.5rem 1fr 1fr;
    grid-template-rows: 3.5rem;
    max-width: 100%;
  }
</style>

<div>
  <div
    on:click={toggleExpand}
    class="w-full bg-white border rounded-xl card border-light-200">
    <div class="flex items-center justify-center p-2">
      <img src={mapping.data.image} alt="CRC" />
    </div>
    <div class="flex items-center">
      <div class="px-1">
        <div class="text-xs md:text-base text-primary">
          {mapping.data.title}
        </div>
        <p class="text-gray-500 text-xxs md:text-xs">
          <span class="text-gray-500">{mapping.data.subtitle}</span>
        </p>
      </div>
    </div>
    <div>
      <!-- <div class="flex items-center justify-end p-2">
        <ButtonIcon mapping={removeAccess} />
      </div> -->
    </div>
  </div>

  {#if mapping.data.privatekey && openDetail}
    <div class="px-3">
      <div
        class="w-full p-2 text-gray-500 bg-white border-b border-l border-r rounded-b-xl text-xxs md:text-xs border-light-200">
        <div>
          PrivateKey:
          <span class="text-primary">{mapping.data.privatekey}</span>
        </div>
        {#if mapping.data.seedphrase}
          <div>
            Seedphrase:
            <span class="text-primary">{mapping.data.seedphrase}</span>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
