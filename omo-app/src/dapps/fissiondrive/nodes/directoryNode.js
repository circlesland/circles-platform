var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FsNode } from "./fsNode";
import { tryGetDappState } from "../../../libs/o-os/loader";
import { FileNode } from "./fileNode";
//import {defaultTimeout} from "libs/webnative/logFormatted";
export class DirectoryNode extends FsNode {
    constructor() {
        super(...arguments);
        this.type = "directory";
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.title || this.title === "") {
                const fissionAuthState = tryGetDappState("omo.fission.auth:1");
                this.title = fissionAuthState.username;
            }
        });
    }
    onExpand() {
        return __awaiter(this, void 0, void 0, function* () {
            const fissionAuthState = tryGetDappState("omo.fission.auth:1");
            const children = [];
            const childFsNodes = yield fissionAuthState.fission._fs.ls(this.path);
            for (let childFsNode of Object.values(childFsNodes)) {
                if (childFsNode.isFile) {
                    children.push(new FileNode(this, childFsNode.name));
                }
                else {
                    children.push(new DirectoryNode(this, childFsNode.name));
                }
            }
            this.childNodes = children;
        });
    }
}
