var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Directory } from "./directory";
export class Profiles extends Directory {
    constructor(fs) {
        super(fs, ["profiles"]);
    }
    tryGetMyProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tryGetByName("me");
        });
    }
    tryGetMyAvatar() {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.getPath(["me.png"]);
            if (!(yield this.fs.exists(path))) {
                return null;
            }
            const data = yield this.fs.cat(path);
            if (Buffer.isBuffer(data)) {
                return `data:image/png;base64,${data.toString('base64')}`;
            }
            else {
                throw new Error("Returned data is not a Buffer.");
            }
        });
    }
    addOrUpdateMyAvatar(imageData, publish) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.fs.add(this.getPath(["me.png"]), imageData);
            if (publish) {
                yield this.fs.publish();
            }
        });
    }
    addOrUpdateMyProfile(myProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            if (myProfile.name !== "me") {
                throw new Error("The own profile must always have the name 'me'.");
            }
            return yield this.addOrUpdate(myProfile, true, "addOrUpdateMyProfile");
        });
    }
    maintainIndexes(change, entity, hint) {
        return __awaiter(this, void 0, void 0, function* () {
            if (entity.name === "me" && hint !== "addOrUpdateMyProfile") {
                throw new Error(`The 'me' entity is a system entity in '${this.getPath()}' and should not be used directly.`);
            }
            // Add or update a public version of 'me' to my public directory
            if (entity.name === "me") {
                yield this.fs.add("public/Apps/MamaOmo/OmoSapien/profiles/me", JSON.stringify(entity));
            }
        });
    }
}
