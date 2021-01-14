var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Profiles } from "./directories/profiles";
import { Keys } from "./directories/keys";
import { loadFileSystem } from "libs/webnative";
import { CirclesTransactions } from "./directories/circlesTransactions";
import { CirclesTokens } from "./directories/circlesTokens";
import { SessionLogs } from "./directories/logs";
import { Offers } from "./directories/offers";
import { tryGetDappState } from "../o-os/loader";
import { BehaviorSubject } from "rxjs";
import { initAuth } from "./initFission";
export class FissionDrive {
    constructor(fissionAuth) {
        this._fissionAuth = fissionAuth;
    }
    get fs() {
        return this._fs;
    }
    get username() {
        return this._fissionAuth.username;
    }
    get profiles() {
        return this._profiles;
    }
    get keys() {
        return this._keys;
    }
    get transactions() {
        return this._transactions;
    }
    get tokens() {
        return this._tokens;
    }
    get offers() {
        return this._offers;
    }
    get sessionLogs() {
        return this._sessionLogs;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this._fs = yield loadFileSystem(this._fissionAuth.permissions, this._fissionAuth.username);
            this._sessionLogs = new SessionLogs(this._fissionAuth.username, this._fs);
            this._profiles = new Profiles(this._fissionAuth.username, this._fs);
            this._keys = new Keys(this._fissionAuth.username, this._fs);
            this._transactions = new CirclesTransactions(this._fissionAuth.username, this._fs);
            this._tokens = new CirclesTokens(this._fissionAuth.username, this._fs);
            this._offers = new Offers(this._fissionAuth.username, this._fs);
        });
    }
}
let initializingDrive = false;
export function runWithDrive(func) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let fissionAuthState = tryGetDappState("omo.fission.auth:1");
        if (!fissionAuthState) {
            const initAuthSuccess = yield initAuth();
            if (!initAuthSuccess) {
                throw new Error("Cannot access your fission drive: The authorization failed.");
            }
        }
        fissionAuthState = tryGetDappState("omo.fission.auth:1");
        if (!fissionAuthState.fission) {
            fissionAuthState.fission = new BehaviorSubject(null);
        }
        const existingDrive = (_a = fissionAuthState.fission.getValue()) === null || _a === void 0 ? void 0 : _a.payload;
        if (!existingDrive && !initializingDrive) {
            const initFsBegin = Date.now();
            initializingDrive = true;
            // FS is not loaded yet. Load it.
            const drive = new FissionDrive(fissionAuthState.fissionState);
            drive.init().then(() => {
                const current = fissionAuthState.fission.getValue();
                fissionAuthState.fission.next({
                    signal: current === null || current === void 0 ? void 0 : current.signal,
                    payload: drive
                });
                const initFsEnd = Date.now();
                const initFsDuration = (initFsEnd - initFsBegin) / 1000;
                window.o.logger.log("initFsDuration", initFsDuration);
                initializingDrive = false;
            });
        }
        return new Promise((resolve, reject) => {
            const sub = fissionAuthState.fission.subscribe((fissionDrive) => __awaiter(this, void 0, void 0, function* () {
                if (!fissionDrive || !(fissionDrive.payload instanceof FissionDrive))
                    return;
                func(fissionDrive.payload)
                    .then(result => {
                    resolve(result);
                    sub.unsubscribe();
                })
                    .catch(error => {
                    reject(error);
                    sub.unsubscribe();
                });
            }));
        });
    });
}
export function withTimeout(operationName, func, timeout) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let resolved = false;
            if (timeout) {
                setTimeout(() => {
                    if (resolved) {
                        return;
                    }
                    reject(new Error(`The execution of ${operationName} timed out after ${timeout / 1000} seconds.`));
                }, timeout);
            }
            try {
                func()
                    .then(result => {
                    resolved = true;
                    resolve(result);
                })
                    .catch(error => reject(error));
            }
            catch (e) {
                reject(e);
            }
        });
    });
}
