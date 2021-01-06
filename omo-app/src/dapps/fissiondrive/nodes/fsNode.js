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
import { runWithDrive } from "../../../libs/o-fission/initFission";
//import {defaultTimeout} from "webnative/logFormatted";
export class FsNode {
    constructor(parent, name) {
        this.childNodes = [];
        this.parent = parent;
        this.name = name;
        this.title = name;
    }
    get path() {
        const fissionAuthState = tryGetDappState("omo.fission.auth:1");
        let current = this;
        let path = [];
        while (current) {
            path.unshift(current.name);
            current = current.parent;
        }
        throw new Error("Deine Mudda!");
        // return fissionAuthState.fission.fs.appPath(path);
    }
    onCollapse() {
        return __awaiter(this, void 0, void 0, function* () {
            this.childNodes = [];
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield runWithDrive((fissionDrive) => __awaiter(this, void 0, void 0, function* () {
                yield fissionDrive.fs.rm(this.path);
                yield fissionDrive.fs.publish();
            }));
        });
    }
}
