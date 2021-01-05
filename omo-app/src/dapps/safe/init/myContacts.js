var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { setDappState, tryGetDappState } from "../../../libs/o-os/loader";
import { BehaviorSubject } from "rxjs";
import { DelayedTrigger } from "../../../libs/o-os/delayedTrigger";
import { CirclesAccount } from "../../../libs/o-circles-protocol/model/circlesAccount";
import { BlockIndex } from "../../../libs/o-os/blockIndex";
import { ForeignProfile } from "../../../libs/o-fission/directories/foreignProfile";
const myContactsSubject = new BehaviorSubject([]);
const blockIndex = new BlockIndex();
const myContacts = {};
const circlesProfiles = {};
const updateTrigger = new DelayedTrigger(30, () => __awaiter(void 0, void 0, void 0, function* () {
    const fissionAuthState = tryGetDappState("omo.fission.auth:1");
    const omosapienState = tryGetDappState("omo.sapien:1");
    const safeState = tryGetDappState("omo.safe:1");
    const circlesApiUrls = Object.values(myContacts)
        .filter(o => !circlesProfiles[o.safeAddress])
        .map(o => {
        circlesProfiles[o.safeAddress] = {
            safeAddress: o.safeAddress,
            loaded: false
        };
        return "address[]=" + o.safeAddress;
    }).join("&");
    yield Promise.all(Object.values(myContacts)
        .filter(o => omosapienState.directory.byCirclesSafe[o.safeAddress])
        .map((o) => __awaiter(void 0, void 0, void 0, function* () {
        const directoryEntry = omosapienState.directory.byCirclesSafe[o.safeAddress];
        try {
            if (o.safeAddress == safeState.mySafeAddress) {
                o.omoProfile = {
                    profile: omosapienState.myProfile,
                    avatar: yield fissionAuthState.fission.profiles.tryGetMyAvatar()
                };
            }
            else {
                o.omoProfile = yield ForeignProfile.findByFissionUsername(directoryEntry.fissionName);
            }
        }
        catch (e) {
            console.warn("An error occurred while loading the fission contacts:", e);
        }
    })));
    if (circlesApiUrls !== "") {
        const url = "https://api.circles.garden/api/users/?" + circlesApiUrls;
        const response = yield fetch(url);
        const responseJson = yield response.json();
        responseJson.data.forEach(entry => {
            circlesProfiles[entry.safeAddress] = entry;
            myContacts[entry.safeAddress].circlesProfile = entry;
        });
    }
    myContactsSubject.next(Object.values(myContacts));
}));
export function initMyContacts() {
    return __awaiter(this, void 0, void 0, function* () {
        const safeState = tryGetDappState("omo.safe:1");
        const circlesAccount = new CirclesAccount(safeState.mySafeAddress);
        circlesAccount.subscribeToMyContacts().subscribe(trustEvent => {
            indexContact(safeState, trustEvent);
            updateTrigger.trigger();
        });
        setDappState("omo.safe:1", existing => {
            return Object.assign(Object.assign({}, existing), { myContacts: myContactsSubject });
        });
    });
}
function indexContact(safeState, event) {
    var _a, _b;
    const { canSendTo, user, limit } = event.returnValues;
    const blockNo = event.blockNumber.toNumber();
    const direction = user == safeState.mySafeAddress
        ? "in"
        : "out";
    blockIndex.addSnapshot("lastBlockNo", blockNo);
    if (direction == "in") {
        const contact = (_a = myContacts[canSendTo]) !== null && _a !== void 0 ? _a : {
            lastBlockNo: blockNo,
            safeAddress: canSendTo,
            trust: {
                in: parseInt(limit),
                out: null
            }
        };
        contact.trust.in = limit;
        contact.lastBlockNo = contact.lastBlockNo <= blockNo ? blockNo : contact.lastBlockNo;
        myContacts[canSendTo] = contact;
    }
    if (direction == "out") {
        const contact = (_b = myContacts[user]) !== null && _b !== void 0 ? _b : {
            lastBlockNo: blockNo,
            safeAddress: user,
            trust: {
                in: null,
                out: parseInt(limit)
            }
        };
        contact.trust.out = limit;
        contact.lastBlockNo = contact.lastBlockNo <= blockNo ? blockNo : contact.lastBlockNo;
        myContacts[user] = contact;
    }
    blockIndex.addBlock(blockNo);
}
