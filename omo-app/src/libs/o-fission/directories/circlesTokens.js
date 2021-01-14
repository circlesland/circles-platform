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
export class CirclesTokens extends Directory {
    constructor(fissionUser, fs) {
        super(fissionUser, fs, ["tokens"]);
    }
    tryGetMyToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.tryGetEntityByName("me");
            if (!result) {
                return null;
            }
            return result;
        });
    }
    addMyToken(myToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (myToken.name !== "me") {
                throw new Error("The own token must always have the name 'me'.");
            }
            return yield this.addOrUpdateEntity(myToken, true, "addMyToken");
        });
    }
    maintainIndexes(change, entity, hint) {
        return __awaiter(this, void 0, void 0, function* () {
            if (entity.name === "me" && hint !== "addMyToken") {
                throw new Error(`The 'me' entity is a system entity in '${this.getPath()}' and should not be used directly.`);
            }
        });
    }
}
