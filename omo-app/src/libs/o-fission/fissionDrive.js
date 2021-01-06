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
import { loadFileSystem } from "webnative";
import { CirclesTransactions } from "./directories/circlesTransactions";
import { CirclesTokens } from "./directories/circlesTokens";
import { Offers } from "./directories/offers";
export class FissionDrive {
    constructor(fissionAuth) {
        this._fissionAuth = fissionAuth;
        this.init();
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
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this._fs = yield loadFileSystem(this._fissionAuth.permissions, this._fissionAuth.username);
            this._profiles = new Profiles(this._fs);
            this._keys = new Keys(this._fs);
            this._transactions = new CirclesTransactions(this._fs);
            this._tokens = new CirclesTokens(this._fs);
            this._offers = new Offers(this._fs);
        });
    }
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
