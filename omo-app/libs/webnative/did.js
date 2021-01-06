var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as base58 from 'base58-universal/main.js';
import { CryptoSystem } from 'keystore-idb/types';
import eccOperations from 'keystore-idb/ecc/operations';
import rsaOperations from 'keystore-idb/rsa/operations';
import utils from 'keystore-idb/utils';
import * as dns from './dns';
import * as keystore from './keystore';
import { arrbufs } from './common';
import { setup } from './setup/internal';
var ECC_DID_PREFIX = new Uint8Array([0xed, 0x01]).buffer;
var RSA_DID_PREFIX = new Uint8Array([0x00, 0xf5, 0x02]).buffer;
var BASE58_DID_PREFIX = 'did:key:z';
// KINDS
/**
 * Create a DID based on the exchange key-pair.
 */
export function exchange() {
    return __awaiter(this, void 0, void 0, function () {
        var ks, pubKeyB64;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, keystore.get()];
                case 1:
                    ks = _a.sent();
                    return [4 /*yield*/, ks.publicReadKey()];
                case 2:
                    pubKeyB64 = _a.sent();
                    return [2 /*return*/, publicKeyToDid(pubKeyB64, ks.cfg.type)];
            }
        });
    });
}
/**
 * Get the root write-key DID for a user.
 * Stored at `_did.${username}.${endpoints.user}`
 */
export function root(username) {
    return __awaiter(this, void 0, void 0, function () {
        var domain, maybeDid, _err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    domain = setup.endpoints.user;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dns.lookupTxtRecord("_did." + username + "." + domain)];
                case 2:
                    maybeDid = _a.sent();
                    if (maybeDid !== null)
                        return [2 /*return*/, maybeDid];
                    return [3 /*break*/, 4];
                case 3:
                    _err_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: throw new Error("Could not locate user DID in DNS.");
            }
        });
    });
}
/**
 * Alias `write` to `ucan`
 */
export { write as ucan };
/**
 * Create a DID based on the write key-pair.
 */
export function write() {
    return __awaiter(this, void 0, void 0, function () {
        var ks, pubKeyB64;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, keystore.get()];
                case 1:
                    ks = _a.sent();
                    return [4 /*yield*/, ks.publicWriteKey()];
                case 2:
                    pubKeyB64 = _a.sent();
                    return [2 /*return*/, publicKeyToDid(pubKeyB64, ks.cfg.type)];
            }
        });
    });
}
// TRANSFORMERS
/**
 * Convert a base64 public key to a DID (did:key).
 */
export function publicKeyToDid(publicKey, type) {
    var pubKeyBuf = utils.base64ToArrBuf(publicKey);
    // Prefix public-write key
    var prefix = magicBytes(type) || new ArrayBuffer(0);
    var prefixedBuf = utils.joinBufs(prefix, pubKeyBuf);
    // Encode prefixed
    return BASE58_DID_PREFIX + base58.encode(new Uint8Array(prefixedBuf));
}
/**
 * Convert a DID (did:key) to a base64 public key.
 */
export function didToPublicKey(did) {
    if (!did.startsWith(BASE58_DID_PREFIX)) {
        throw new Error("Please use a base58-encoded DID formatted `did:key:z...`");
    }
    var didWithoutPrefix = did.substr(BASE58_DID_PREFIX.length);
    var magicalBuf = base58.decode(didWithoutPrefix).buffer;
    var _a = parseMagicBytes(magicalBuf), keyBuffer = _a.keyBuffer, type = _a.type;
    return {
        publicKey: utils.arrBufToBase64(keyBuffer),
        type: type
    };
}
// VALIDATION
/**
 * Verify the signature of some data (string, ArrayBuffer or Uint8Array), given a DID.
 */
export function verifySignedData(_a) {
    var _b = _a.charSize, charSize = _b === void 0 ? 16 : _b, data = _a.data, did = _a.did, signature = _a.signature;
    return __awaiter(this, void 0, void 0, function () {
        var _c, type, publicKey, _d, _1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 7, , 8]);
                    _c = didToPublicKey(did), type = _c.type, publicKey = _c.publicKey;
                    _d = type;
                    switch (_d) {
                        case "ecc": return [3 /*break*/, 1];
                        case "rsa": return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 5];
                case 1: return [4 /*yield*/, eccOperations.verify(data, signature, publicKey, charSize)];
                case 2: return [2 /*return*/, _e.sent()];
                case 3: return [4 /*yield*/, rsaOperations.verify(data, signature, publicKey, charSize)];
                case 4: return [2 /*return*/, _e.sent()];
                case 5: return [2 /*return*/, false];
                case 6: return [3 /*break*/, 8];
                case 7:
                    _1 = _e.sent();
                    return [2 /*return*/, false];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// ㊙️
/**
 * Magic bytes.
 */
function magicBytes(cryptoSystem) {
    switch (cryptoSystem) {
        case CryptoSystem.RSA: return RSA_DID_PREFIX;
        default: return null;
    }
}
/**
 * Parse magic bytes on prefixed key-buffer
 * to determine cryptosystem & the unprefixed key-buffer.
 */
var parseMagicBytes = function (prefixedKey) {
    // RSA
    if (hasPrefix(prefixedKey, RSA_DID_PREFIX)) {
        return {
            keyBuffer: prefixedKey.slice(RSA_DID_PREFIX.byteLength),
            type: CryptoSystem.RSA
        };
        // ECC
    }
    else if (hasPrefix(prefixedKey, ECC_DID_PREFIX)) {
        return {
            keyBuffer: prefixedKey.slice(ECC_DID_PREFIX.byteLength),
            type: CryptoSystem.ECC
        };
    }
    throw new Error("Unsupported key algorithm. Try using RSA.");
};
/**
 * Determines if an ArrayBuffer has a given indeterminate length-prefix.
 */
var hasPrefix = function (prefixedKey, prefix) {
    return arrbufs.equal(prefix, prefixedKey.slice(0, prefix.byteLength));
};
//# sourceMappingURL=did.js.map