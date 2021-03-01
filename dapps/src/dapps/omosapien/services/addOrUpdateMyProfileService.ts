import { CreateOmoSapienContext } from "../processes/createOmoSapien/createOmoSapien";
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-avataaars-sprites";
import {OmoSapienState} from "../manifest";
import {runWithDrive} from "omo-fission/dist/fissionDrive";
import {Profile} from "omo-models/dist/omo/profile";
import {setDappState, tryGetDappState} from "omo-kernel/dist/kernel";
import {uploadFileAndGetCid} from "omo-fission/dist/fissionUtil";

export const addOrUpdateMyProfileService = async (context: CreateOmoSapienContext) =>
{
  await runWithDrive(async fissionDrive =>
  {
    const omosapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");
    const profile = omosapienState.myProfile ?? <Profile>{};

    profile.name = "me";
    profile.firstName = context.data.firstName.value;
    profile.lastName = context.data.lastName ? context.data.lastName.value : null;

    const fissionUsername = fissionDrive.username;
    let avatarBytes = context.data.avatar ? context.data.avatar.value : null
    let avatarMimeType = "image/png";
    if (!avatarBytes) {
      let avatars = new Avatars(sprites);
      let svg = avatars.create(fissionUsername);
      avatarMimeType = "image/svg+xml";
      avatarBytes = Buffer.from(svg, "utf-8");
    }

    profile.omoAvatarMimeType = avatarMimeType;
    profile.omoAvatarCid = await uploadFileAndGetCid(
      "public/Apps/MamaOmo/OmoSapien/Avatars/",
      "me",
      avatarBytes);

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
