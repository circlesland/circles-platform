import {JumpstartContext} from "../processes/omo/jumpstart";
import {tryGetDappState} from "../../../libs/o-os/loader";
import {OmoSapienState} from "../../omosapien/manifest";

export const getForeignProfileService = async (context: JumpstartContext) =>
{
  const omosapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");
  const profileIndex = omosapienState.profileIndex.getValue();

  if (!profileIndex)
  {
    throw new Error("This service needs the 'omo.sapien:1'.profileIndex to function.");
  }

  const foreignProfile = profileIndex.payload.byFissionName[context.data.foreignProfileFissionName.value];
  if (!foreignProfile)
  {
    throw new Error(`Tried to get the profile of fission user '${context.data.foreignProfileFissionName.value}' from the 'omosapienState.profileIndex' but couldn't find an entry.`)
  }

  return foreignProfile;
}
