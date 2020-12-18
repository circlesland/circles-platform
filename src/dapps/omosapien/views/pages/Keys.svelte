<script lang="ts">
  import CategoryTitle from "src/libs/o-views/atoms/CategoryTitle.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import KeyItem from "src/libs/o-views/molecules/KeyItem.svelte";
  import { onMount } from "svelte";
  import { getEnvironment } from "src/libs/o-os/o";
  import { labelKeys } from "../../data/keys";
  import Mobile from "src/libs/o-views/templates/Mobile.svelte";
  import {tryGetDappState} from "../../../../libs/o-os/loader";
  import {OmoSafeState} from "../../../safe/manifest";
  import {FissionAuthState} from "../../../fissionauth/manifest";

  let keys: any[] = [];

  async function getKeys() {
    const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
    keys = (await fissionAuthState.fission.keys.listItems()).map((o) => {
      return {
        data: {
          image: "/icons/paperWallet.svg",
          title: o.name,
          subtitle: "PrivateKey",
          privatekey: o.privateKey,
        },
      };
    });
  }

  onMount(() => getKeys());
</script>

<Mobile>
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
</Mobile>
