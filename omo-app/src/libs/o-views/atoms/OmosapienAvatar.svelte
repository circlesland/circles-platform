<script lang="ts">
  import {runWithDrive} from "../../o-fission/initFission";
  import {ProfileIndex} from "../../o-fission/indexes/profileIndex";

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
        dataUrl = await fissionDrive.profiles.tryGetMyAvatar();
      }
      else
      {
        console.log("await ProfileIndex.tryReadPublicProfile(" + fissionUsername + ") ..")
        const data = await ProfileIndex.tryReadPublicProfile(fissionUsername);

        if (data.avatarDataUrl)
        {
          dataUrl = data.avatarDataUrl;
        }
      }
    });
  }

  init();
</script>
<img src={dataUrl} class={classes} />
