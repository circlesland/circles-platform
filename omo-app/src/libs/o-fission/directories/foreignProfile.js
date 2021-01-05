var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class ForeignProfile {
    static findByFissionUsername(fissionUsername, loadAvatar = true) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Remove the hardcoded gateway and either use the webnative library or ipfs directly for this lookup
            try {
                const dnsLink = `https://ipfs.io/api/v0/dns?arg=${fissionUsername}.fission.name`;
                const dnsLinkResult = yield fetch(dnsLink);
                const dnsLinkResultObj = yield dnsLinkResult.json();
                if (!dnsLinkResultObj || !dnsLinkResultObj.Path) {
                    return;
                }
                const otherProfilePath = `https://ipfs.io/${dnsLinkResultObj.Path}/userland/Apps/userland/MamaOmo/userland/OmoSapien/userland/profiles/userland/me/userland`;
                const otherProfileData = yield fetch(otherProfilePath);
                const otherProfileObj = yield otherProfileData.json();
                if (!otherProfileObj)
                    return null;
                if (loadAvatar) {
                    const otherProfileAvatarUrl = `https://ipfs.io/${dnsLinkResultObj.Path}/userland/Apps/userland/MamaOmo/userland/OmoSapien/userland/profiles/userland/me.png/userland`;
                    try {
                        const otherProfileAvatarData = yield fetch(otherProfileAvatarUrl);
                        if (otherProfileAvatarData.status == 404) {
                            return {
                                profile: Object.assign({ name: "" }, otherProfileObj),
                                avatar: null
                            };
                        }
                        if (otherProfileAvatarData.status != 200) {
                            throw new Error("Got a non 200 response for url " + otherProfileAvatarUrl);
                        }
                        const blob = yield otherProfileAvatarData.blob();
                        const buffer = Buffer.from(blob);
                        return {
                            profile: Object.assign({ name: "" }, otherProfileObj),
                            avatar: `data:image/png;base64,${buffer.toString('base64')}`
                        };
                    }
                    catch (e) {
                        console.warn("Couldn't load the avatar of '" + fissionUsername + "'");
                    }
                }
                return {
                    profile: Object.assign({ name: "" }, otherProfileObj),
                    avatar: null
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
