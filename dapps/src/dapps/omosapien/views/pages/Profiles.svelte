<script lang="ts">
  import CategoryTitle from "src/libs/o-views/atoms/CategoryTitle.svelte";
  import ProfileItem from "src/libs/o-views/molecules/ProfileItem.svelte";
  import {
    labelOmoSapiens,
    labelCoops,
    omoSapiens,
    coops,
  } from "../../data/profiles";
</script>

<div>
  <div class="my-2">
    <CategoryTitle mapping={labelOmoSapiens} />
  </div>
  <div class="space-y-2">
    {#each omoSapiens as item}
      <ProfileItem mapping={item} />
    {/each}
  </div>
  <div class="my-2">
    <CategoryTitle mapping={labelCoops} />
  </div>
  <div class="space-y-2">
    {#each coops as item}
      <ProfileItem mapping={item} />
    {/each}
  </div>
</div>
