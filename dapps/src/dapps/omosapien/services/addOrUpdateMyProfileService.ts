import { CreateOmoSapienContext } from "../processes/createOmoSapien/createOmoSapien";
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-avataaars-sprites";
import {OmoSapienState} from "../manifest";
import {runWithDrive} from "omo-fission/dist/fissionDrive";
import {Profile} from "omo-models/dist/omo/profile";
import {setDappState, tryGetDappState} from "omo-kernel/dist/kernel";
import {uploadFileAndGetCid} from "omo-fission/dist/fissionUtil";
import {OmoCentral} from "omo-central/dist/omoCentral";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {Generate} from "omo-utils/dist/generate";

async function getAvatarData(fissionUsername:string, imageArtifact?:ProcessArtifact) : Promise<{
  bytes:Buffer,
  cid: string,
  mimeType: string,
  filename: string
}> {
  let bytes = imageArtifact ? imageArtifact.value : null;
  let avatarMimeType = "image/png";
  if (!bytes) {
    let avatars = new Avatars(sprites);
    let svg = avatars.create(fissionUsername);
    avatarMimeType = "image/svg+xml";
    bytes = Buffer.from(svg, "utf-8");
  }

  const mimeType = avatarMimeType;
  const uploadInfo = await uploadAvatarData({
    bytes,
    mimeType
  }, "me");

  return uploadInfo
}

async function uploadAvatarData(avatarData:{ bytes:Buffer, mimeType: string }, filename?:string) {
  filename = filename ?? Generate.randomHexString();
  const cid = await uploadFileAndGetCid(
    "public/Apps/MamaOmo/OmoSapien/Avatars/",
    filename,
    avatarData.bytes);

  return {
    filename,
    mimeType: avatarData.mimeType,
    cid,
    bytes: avatarData.bytes
  }
}

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
    let avatarBytes = await getAvatarData(fissionUsername, context.data.avatar);

    if (avatarBytes.bytes)
    {
      await fissionDrive.profiles.addOrUpdateMyAvatar(avatarBytes.bytes, false);
    }

    const omoCentral = await OmoCentral.instance.subscribeToResult();
    await omoCentral.upsertProfile({
      circlesAddress: profile.circlesAddress,
      omoAvatarCid: profile.omoAvatarCid,
      omoAvatarMimeType: profile.omoAvatarMimeType,
      omoFirstName: profile.firstName,
      omoLastName: profile.lastName
    });
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
