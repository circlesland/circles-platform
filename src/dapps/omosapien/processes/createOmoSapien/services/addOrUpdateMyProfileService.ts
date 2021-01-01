import { CreateOmoSapienContext } from "../createOmoSapien";
import { Profile } from "../../../../../libs/o-fission/entities/profile";
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-avataaars-sprites";
import {setDappState, tryGetDappState} from "../../../../../libs/o-os/loader";
import {FissionAuthState} from "../../../../fissionauth/manifest";
import {OmoSapienState} from "../../../manifest";

export const addOrUpdateMyProfileService = async (context: CreateOmoSapienContext) =>
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  if (!fissionAuthState.fission) {
    throw new Error("You're not authenticated");
  }

  const omosapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");
  const profile = omosapienState.myProfile ?? <Profile>{};

  profile.name = "me";
  profile.firstName = context.data.firstName.value;
  profile.lastName = context.data.lastName ? context.data.lastName.value : null;
  profile.avatar = context.data.avatar ? context.data.avatar.value : null;

  const fissionUsername = fissionAuthState.fission.username;

  if (!profile.avatar) {
    let avatars = new Avatars(sprites);
    let svg = avatars.create(fissionUsername);
    let dataUri = `data:image/svg+xml;base64,${btoa(svg)}`;
    profile.avatar = dataUri;
  }

  await fissionAuthState.fission.profiles.addOrUpdateMyProfile(profile);

  setDappState<OmoSapienState>("omo.sapien:1", current => {
    current.myProfile = profile;
    return current;
  });
}
