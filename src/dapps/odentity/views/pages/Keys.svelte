<script>
  import CategoryTitle from "src/libs/o-views/atoms/CategoryTitle.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import AccessItem from "src/libs/o-views/molecules/AccessItem.svelte";
  import { labelKeys, keys } from "./../../data/keys";
</script>

<Compose rows="1fr" columns="1fr" tw="px-4 lg:p-6">
  <div>
    <CategoryTitle mapping={labelKeys} />
    <div class="space-y-2">
      {#each keys as item}
        <AccessItem mapping={item} />
      {/each}
    </div>
  </div>
</Compose>
