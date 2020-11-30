<script>
  import CategoryTitle from "src/libs/o-views/atoms/CategoryTitle.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import KeyItem from "src/libs/o-views/molecules/KeyItem.svelte";
  import { labelKeys, keys } from "./../../data/keys";
</script>

<Compose rows="1fr" columns="1fr" tw="m-4 lg:m-0">
  <div>
    <div class="mb-2">
      <CategoryTitle mapping={labelKeys} />
    </div>
    <div class="space-y-2">
      {#each keys as item}
        <KeyItem mapping={item} />
      {/each}
    </div>
  </div>
</Compose>
