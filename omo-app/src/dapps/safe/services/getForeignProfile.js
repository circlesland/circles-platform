var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ForeignProfile } from "../../../libs/o-fission/directories/foreignProfile";
export const getForeignProfileService = (context) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("loading foreign profile by fission name:", context.data.foreignProfileFissionName.value);
    const foreignProfile = yield ForeignProfile.findByFissionUsername(context.data.foreignProfileFissionName.value);
    console.log("got foreign profile:", foreignProfile);
    return foreignProfile;
});
