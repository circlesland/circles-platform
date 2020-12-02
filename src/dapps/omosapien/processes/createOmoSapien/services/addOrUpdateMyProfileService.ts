import { CreateOmoSapienContext } from "../createOmoSapien";
import {Profile} from "../../../../../libs/o-fission/entities/profile";
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-avataaars-sprites";
import {RefreshView} from "../../../../../libs/o-events/refreshView";

export const addOrUpdateMyProfileService = async (context: CreateOmoSapienContext) => {
  if (!window.o.fission) {
    throw new Error("You're not authenticated");
  }

  const profile = context.environment.me.myProfile ?? <Profile>{};
  profile.name = "me";

  profile.firstName = context.data.firstName.value;
  profile.lastName = context.data.lastName ? context.data.lastName.value : null;
  profile.avatar = context.data.avatar ? context.data.avatar.value : null;

  const fissionUsername = context.environment.fission.username;

  if (!profile.avatar)
  {
    let avatars = new Avatars(sprites);
    let svg = avatars.create(fissionUsername);
    let dataUri = `data:image/svg+xml;base64,${btoa(svg)}`;
    profile.avatar = dataUri;
  }

  await context.environment.fission.profiles.addOrUpdateMyProfile(profile);

  window.o.publishEvent(new RefreshView("omosapien.profile"));
}
