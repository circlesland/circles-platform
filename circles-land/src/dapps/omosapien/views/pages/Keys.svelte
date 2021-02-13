<script lang="ts">
  import CategoryTitle from "src/libs/o-views/atoms/CategoryTitle.svelte";
  import KeyItem from "src/libs/o-views/molecules/KeyItem.svelte";
  import { onMount } from "svelte";
  import { labelKeys } from "../../data/keys";
  import {runWithDrive} from "omo-fission/dist/fissionDrive";

  let keys: any[] = [];

  async function getKeys() {
    await runWithDrive(async fissiondrive => {
      keys = (await fissiondrive.keys.listItems()).map((o) => {
        return {
          data: {
            image: "/icons/paperWallet.svg",
            title: o.name,
            subtitle: "PrivateKey",
            privatekey: o.privateKey,
          },
        };
      });
    });
  }

  onMount(() => getKeys());
</script>

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
