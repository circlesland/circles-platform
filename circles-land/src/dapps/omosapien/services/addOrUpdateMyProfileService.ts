import { CreateOmoSapienContext } from "../processes/createOmoSapien/createOmoSapien";
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-avataaars-sprites";
import {OmoSapienState} from "../manifest";
import {runWithDrive} from "omo-fission/dist/fissionDrive";
import {Profile} from "omo-models/dist/omo/profile";
import {setDappState, tryGetDappState} from "omo-kernel/dist/kernel";
import {omoCentralClient} from "omo-central-client/src/omoCentralClient";

export const addOrUpdateMyProfileService = async (context: CreateOmoSapienContext) =>
{
  await runWithDrive(async fissionDrive =>
  {
    const omosapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");
    const profile = omosapienState.myProfile ?? <Profile>{};

    profile.name = "me";
    profile.firstName = context.data.firstName.value;
    profile.lastName = context.data.lastName ? context.data.lastName.value : null;
    //profile.avatar = fissionAuthState.fission.profiles.getPath(["me.png"]);

    const fissionUsername = fissionDrive.username;

    const hasAvatar = await fissionDrive.fs.exists(fissionDrive.profiles.getPath(["me.png"]));
    let avatarBytes = context.data.avatar ? context.data.avatar.value : null

    if (!hasAvatar && !avatarBytes) {
      let avatars = new Avatars(sprites);
      let svg = avatars.create(fissionUsername);
      let dataUri = `data:image/svg+xml;base64,${btoa(svg)}`;
      avatarBytes = dataUri;
    }

    if (avatarBytes)
    {
      const avatarBuffer = Buffer.from(avatarBytes);
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
