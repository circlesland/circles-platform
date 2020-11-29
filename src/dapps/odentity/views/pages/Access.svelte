<script lang="ts">
  import CategoryTitle from "src/libs/o-views/atoms/CategoryTitle.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import AccessItem from "src/libs/o-views/molecules/AccessItem.svelte";
  import {
    labelDevices,
    labelDapps,
    accessDapps,
    accessDevices,
  } from "./../../data/access";
</script>

<Compose rows="1fr" columns="1fr" tw="mx-4 mt-4 md:m-0" overflowY>
  <div>
    <div class="mb-2">
      <CategoryTitle mapping={labelDevices} />
    </div>
    <div class="space-y-2">
      {#each accessDevices as item}
        <AccessItem mapping={item} />
      {/each}
    </div>
    <div class="my-2">
      <CategoryTitle mapping={labelDapps} />
    </div>
    <div class="space-y-2">
      {#each accessDapps as item}
        <AccessItem mapping={item} />
      {/each}
    </div>
  </div>
</Compose>
