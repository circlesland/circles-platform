var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { tryGetDappState } from "../../../libs/o-os/loader";
export const getForeignProfileService = (context) => __awaiter(void 0, void 0, void 0, function* () {
    const omosapienState = tryGetDappState("omo.sapien:1");
    const profileIndex = omosapienState.profileIndex.getValue();
    if (!profileIndex) {
        throw new Error("This service needs the 'omo.sapien:1'.profileIndex to function.");
    }
    const foreignProfile = profileIndex.payload.byFissionName[context.data.foreignProfileFissionName.value];
    if (!foreignProfile) {
        throw new Error(`Tried to get the profile of fission user '${context.data.foreignProfileFissionName.value}' from the 'omosapienState.profileIndex' but couldn't find an entry.`);
    }
    return foreignProfile;
});
