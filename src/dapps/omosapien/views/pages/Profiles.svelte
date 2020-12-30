<script lang="ts">
  import CategoryTitle from "src/libs/o-views/atoms/CategoryTitle.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import ProfileItem from "src/libs/o-views/molecules/ProfileItem.svelte";
  import Mobile from "src/libs/o-views/templates/Mobile.svelte";
  import {
    labelOmoSapiens,
    labelCoops,
    omoSapiens,
    coops,
  } from "../../data/profiles";
</script>

<Mobile>
  <Compose rows="1fr" columns="1fr" tw="mx-4 mt-4 md:m-0" overflowY>
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
  </Compose>
</Mobile>
