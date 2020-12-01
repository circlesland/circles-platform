<script lang="ts">
  import CategoryTitle from "src/libs/o-views/atoms/CategoryTitle.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import KeyItem from "src/libs/o-views/molecules/KeyItem.svelte";
  import { labelKeys } from "./../../data/keys";
  import {getEnvironment} from "../../../../libs/o-os/o";
  import {onMount} from "svelte";

  let keys:any[] = [];

  async function getKeys() {
    const env = await getEnvironment();
    keys = (await env.me.myData.keys.listItems()).map(o => {
      return {
        data: {
          image: "/icons/paperWallet.svg",
          title: o.name,
          subtitle: "PrivateKey",
          privatekey: o.privateKey,
        },
      }
    });
  }

  onMount(() =>  getKeys());
</script>

<Compose rows="1fr" columns="1fr" tw="m-4 md:m-0">
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
