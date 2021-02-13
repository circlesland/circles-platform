import { CreateOmoSapienContext } from "../createOmoSapien";
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-avataaars-sprites";
import {OmoSapienState} from "../../../manifest";
import {runWithDrive} from "omo-fission/dist/fissionDrive";
import {Profile} from "omo-models/dist/omo/profile";
import {setDappState, tryGetDappState} from "omo-kernel/dist/kernel";

export const addOrUpdateMyProfileService = async (context: CreateOmoSapienContext) =>
{
  await runWithDrive(async fissionDrive =>
  {
    const omosapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");
    const profile = omosapienState.myProfile ?? <Profile>{};

    profile.name = "me";
    profile.firstName = context.data.firstName.value;
    profile.lastName = context.data.lastName ? context.data.lastName.value : null;
    // profile.avatar = fissionAuthState.fission.profiles.getPath(["me.png"]);

    const fissionUsername = fissionDrive.username;

    const hasAvatar = await fissionDrive.fs.exists(fissionDrive.profiles.getPath(["me.png"]));
    let avatarDataUrl = context.data.avatar ? context.data.avatar.value : null

    if (!hasAvatar && !avatarDataUrl) {
      let avatars = new Avatars(sprites);
      let svg = avatars.create(fissionUsername);
      let dataUri = `data:image/svg+xml;base64,${btoa(svg)}`;
      avatarDataUrl = dataUri;
    }

    if (avatarDataUrl)
    {
      const avatarBuffer = Buffer.from(avatarDataUrl.split(",")[1], 'base64');
      await fissionDrive.profiles.addOrUpdateMyAvatar(avatarBuffer, false);
    }

    await fissionDrive.profiles.addOrUpdateMyProfile(profile);

    setDappState<OmoSapienState>("omo.sapien:1", current => {
      current.myProfile = profile;
      return current;
    });

    const response = await fetch("https://directory.omo.earth/signup/" + fissionUsername, {
      method: "POST"
    });

    window.o.logger.log(response);
  });
}
