<script lang="ts">
  import {ForeignProfile} from "../../o-fission/directories/foreignProfile";
  import {tryGetDappState} from "../../o-os/loader";
  import {FissionAuthState} from "../../../dapps/fissionauth/manifest";

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

    let fissionAuth = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
    if (fissionAuth.username == fissionUsername)
    {
      dataUrl = await fissionAuth.fission.profiles.tryGetMyAvatar();
    }
    else
    {
      const data = await ForeignProfile.findByFissionUsername(fissionUsername);
      if (data.avatar)
      {
        dataUrl = data.avatar;
      }
    }
  }

  init();
</script>
<img src={dataUrl} class={classes} />
