<script lang="ts">
  import {runWithDrive} from "omo-fission/dist/fissionDrive";
  import {ProfileIndex} from "omo-indexes/dist/profileIndex";

  export let fissionUsername:string;
  export let classes:string;

  let dataUrl:string;
  $: {
    if (fissionUsername)
    {
      init();
    }
  }

  async function init()
  {
    if (!fissionUsername)
    {
      return;
    }
    await runWithDrive(async fissionDrive =>
    {
      if (fissionDrive.username == fissionUsername)
      {
        dataUrl = await fissionDrive.profiles.tryGetMyAvatarDataUrl();
      }
      else
      {
        console.log("await ProfileIndex.tryReadPublicProfile(" + fissionUsername + ") ..")
        const data = await ProfileIndex.tryReadPublicProfile(fissionUsername);

        if (data.avatarCid)
        {
          // TODO: Load image from CID
          dataUrl = data.avatarCid;
        }
      }
    });
  }

  init();
</script>
<img src={dataUrl} class={classes} />
