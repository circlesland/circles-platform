<script lang="ts">
  import { faMinus } from "@fortawesome/free-solid-svg-icons";
  import ButtonIcon from "../atoms/ButtonIcon.svelte";

  interface AccessItem {
    data: {
      image: string;
      title: string;
      subtitle: string;
    };
  }
  export let mapping: AccessItem;

  const removeAccess = {
    design: {
      icon: faMinus,
      type: "light-danger",
    },
  };
</script>

<style>
  .card {
    display: grid;
    grid-template-columns: 3.5rem 1fr 1fr;
    grid-template-rows: 3.5rem;
    max-width: 100%;
  }
</style>

<div class="w-full bg-white border rounded-lg card border-light-200">
  <div class="flex items-center justify-center p-2">
    <img src={mapping.data.image} alt="CRC" />
  </div>
  <div class="px-1 py-2">
    <div class="text-base text-primary">{mapping.data.title}</div>
    <p class="text-xs text-gray-500">
      <span class="text-xs text-gray-500">{mapping.data.subtitle}</span>
    </p>
  </div>
  <div>
    <div class="flex items-center justify-end p-2">
      <ButtonIcon mapping={removeAccess} />
    </div>
  </div>
</div>
