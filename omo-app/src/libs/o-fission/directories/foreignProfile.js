var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { tryGetDappState } from "../../o-os/loader";
export const ipfsCat = (ipfs, cid) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    console.log("ipfsCat:", cid);
    const chunks = [];
    try {
        for (var _b = __asyncValues(ipfs.cat(cid)), _c; _c = yield _b.next(), !_c.done;) {
            const chunk = _c.value;
            console.log("ipfsCat chunk no.:", chunks.length);
            if (Buffer.isBuffer(chunk))
                chunks.push(chunk);
            else
                chunks.push(Buffer.from(chunk));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return Buffer.concat(chunks);
});
export const ipfsGetFile = (ipfs, cid) => __awaiter(void 0, void 0, void 0, function* () {
    var e_2, _d;
    console.log("ipfsGetFile", cid);
    const fileContentCid = ipfs.ls(cid);
    try {
        for (var fileContentCid_1 = __asyncValues(fileContentCid), fileContentCid_1_1; fileContentCid_1_1 = yield fileContentCid_1.next(), !fileContentCid_1_1.done;) {
            const fileCid = fileContentCid_1_1.value;
            if (fileCid.name === "userland") {
                return yield ipfsCat(ipfs, fileCid.cid.toString());
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (fileContentCid_1_1 && !fileContentCid_1_1.done && (_d = fileContentCid_1.return)) yield _d.call(fileContentCid_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return null;
});
export class ForeignProfile {
    static findByFissionUsername(fissionUsername) {
        var e_3, _a;
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Remove the hardcoded gateway and either use the webnative library or ipfs directly for this lookup
            try {
                const fissionAuthState = tryGetDappState("omo.fission.auth:1");
                const dnsLink = `https://ipfs.io/api/v0/dns?arg=${fissionUsername}.fission.name`;
                const dnsLinkResult = yield fetch(dnsLink);
                const dnsLinkResultObj = yield dnsLinkResult.json();
                if (!dnsLinkResultObj || !dnsLinkResultObj.Path) {
                    return;
                }
                let ipfsCid = dnsLinkResultObj.Path;
                ipfsCid = ipfsCid.replace("/ipfs/", "");
                ipfsCid = ipfsCid.replace("/public", "");
                ipfsCid = ipfsCid + "/public/userland/Apps/userland/MamaOmo/userland/OmoSapien/userland/profiles/userland";
                const ipfs = yield fissionAuthState.fission.getValue().fs.getIpfs();
                const dir = yield ipfs.ls(ipfsCid);
                let otherProfileObj;
                let otherProfileAvatar;
                try {
                    for (var dir_1 = __asyncValues(dir), dir_1_1; dir_1_1 = yield dir_1.next(), !dir_1_1.done;) {
                        const element = dir_1_1.value;
                        if (element.name === "me") {
                            const profileBuffer = yield ipfsGetFile(ipfs, element.cid.toString());
                            otherProfileObj = JSON.parse(profileBuffer.toString());
                        }
                        if (element.name === "me.png") {
                            const avatarBuffer = yield ipfsGetFile(ipfs, element.cid.toString());
                            otherProfileAvatar = `data:image/png;base64,${avatarBuffer.toString('base64')}`;
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (dir_1_1 && !dir_1_1.done && (_a = dir_1.return)) yield _a.call(dir_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                return {
                    profile: Object.assign({ name: "" }, otherProfileObj),
                    avatar: otherProfileAvatar
                };
            }
            catch (e) {
                console.warn("Couldn't load a foreign profile:");
                console.warn(e);
                return null;
            }
        });
    }
}
