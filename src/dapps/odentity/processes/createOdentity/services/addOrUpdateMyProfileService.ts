import {CreateOdentityContext} from "../createOdentity";

export const addOrUpdateMyProfileService = async (context: CreateOdentityContext) =>
{
  if (!window.o.fission)
  {
    throw new Error("You're not authenticated");
  }

  await context.environment.fission.profiles.addOrUpdateMyProfile({
    name: "me",
    firstName: context.data.firstName.value,
    lastName: context.data.lastName.value,
    avatar: context.data.avatar.value
  });
}
