<script lang="ts">
  import {ForeignProfile} from "../../o-fission/directories/foreignProfile";
  import {tryGetDappState} from "../../o-os/loader";
  import {FissionAuthState} from "../../../dapps/fissionauth/manifest";
  import {runWithDrive} from "../../o-fission/initFission";

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
        const data = await ForeignProfile.findByFissionUsername(fissionUsername);
        if (data.avatar)
        {
          dataUrl = data.avatar;
        }
      }
    });
  }

  init();
</script>
<img src={dataUrl} class={classes} />
