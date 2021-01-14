var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-avataaars-sprites";
import { setDappState, tryGetDappState } from "../../../../../libs/o-os/loader";
import { runWithDrive } from "../../../../../libs/o-fission/initFission";
export const addOrUpdateMyProfileService = (context) => __awaiter(void 0, void 0, void 0, function* () {
    yield runWithDrive((fissionDrive) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const omosapienState = tryGetDappState("omo.sapien:1");
        const profile = (_a = omosapienState.myProfile) !== null && _a !== void 0 ? _a : {};
        profile.name = "me";
        profile.firstName = context.data.firstName.value;
        profile.lastName = context.data.lastName ? context.data.lastName.value : null;
        // profile.avatar = fissionAuthState.fission.profiles.getPath(["me.png"]);
        const fissionUsername = fissionDrive.username;
        const hasAvatar = yield fissionDrive.fs.exists(fissionDrive.profiles.getPath(["me.png"]));
        let avatarDataUrl = context.data.avatar ? context.data.avatar.value : null;
        if (!hasAvatar && !avatarDataUrl) {
            let avatars = new Avatars(sprites);
            let svg = avatars.create(fissionUsername);
            let dataUri = `data:image/svg+xml;base64,${btoa(svg)}`;
            avatarDataUrl = dataUri;
        }
        if (avatarDataUrl) {
            const avatarBuffer = Buffer.from(avatarDataUrl.split(",")[1], 'base64');
            yield fissionDrive.profiles.addOrUpdateMyAvatar(avatarBuffer, false);
        }
        yield fissionDrive.profiles.addOrUpdateMyProfile(profile);
        setDappState("omo.sapien:1", current => {
            current.myProfile = profile;
            return current;
        });
        const response = yield fetch("https://directory.omo.earth/signup/" + fissionUsername, {
            method: "POST"
        });
        window.o.logger.log(response);
    }));
});
