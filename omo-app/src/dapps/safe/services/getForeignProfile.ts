import {JumpstartContext} from "../processes/omo/jumpstart";
import {ForeignProfile} from "../../../libs/o-fission/directories/foreignProfile";

export const getForeignProfileService = async (context: JumpstartContext) =>
{
  window.o.logger.log("loading foreign profile by fission name:", context.data.foreignProfileFissionName.value);
  const foreignProfile = await ForeignProfile.findByFissionUsername(context.data.foreignProfileFissionName.value);
  window.o.logger.log("got foreign profile:", foreignProfile);

  return foreignProfile;
}
