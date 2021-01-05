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
export class Keys extends Directory {
    constructor(fs) {
        super(fs, ["keys"]);
    }
    tryGetMyKey() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tryGetByName("me");
        });
    }
    addMyKey(myKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (myKey.name !== "me") {
                throw new Error("The circles safe owner keypair must always be named 'me'.");
            }
            if (yield this.exists(["me"])) {
                throw new Error("The circles safe owner keypair cannot be modified.");
            }
            return yield this.addOrUpdate(myKey, true, "addMyKey");
        });
    }
    maintainIndexes(change, entity, hint) {
        return __awaiter(this, void 0, void 0, function* () {
            if (entity.name === "me" && hint !== "addMyKey") {
                throw new Error(`The 'me' entity is a system entity in '${this.getPath()}' and should not be used directly.`);
            }
        });
    }
}
