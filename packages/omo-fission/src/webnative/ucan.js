var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { CryptoSystem } from 'keystore-idb/types';
import * as keystore from './keystore';
import { base64 } from './common';
// CONSTANTS
// TODO: Waiting on API change.
//       Should be `dnslink`
export var WNFS_PREFIX = "floofs";
// FUNCTIONS
/**
 * Create a UCAN, User Controlled Authorization Networks, JWT.
 * This JWT can be used for authorization.
 *
 * ### Header
 *
 * `alg`, Algorithm, the type of signature.
 * `typ`, Type, the type of this data structure, JWT.
 * `uav`, UCAN version.
 *
 * ### Payload
 *
 * `aud`, Audience, the ID of who it's intended for.
 * `exp`, Expiry, unix timestamp of when the jwt is no longer valid.
 * `iss`, Issuer, the ID of who sent this.
 * `nbf`, Not Before, unix timestamp of when the jwt becomes valid.
 * `prf`, Proof, an optional nested token with equal or greater privileges.
 * `ptc`, Potency, which rights come with the token.
 * `rsc`, Resource, the involved resource.
 *
 */
export function build(_a) {
    var audience = _a.audience, _b = _a.facts, facts = _b === void 0 ? [] : _b, issuer = _a.issuer, _c = _a.lifetimeInSeconds, lifetimeInSeconds = _c === void 0 ? 30 : _c, _d = _a.potency, potency = _d === void 0 ? 'APPEND' : _d, proof = _a.proof, _e = _a.resource, resource = _e === void 0 ? '*' : _e;
    return __awaiter(this, void 0, void 0, function () {
        var ks, currentTimeInSeconds, header, exp, nbf, prf, payload, encodedHeader, encodedPayload, signed, encodedSignature;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, keystore.get()];
                case 1:
                    ks = _f.sent();
                    currentTimeInSeconds = Math.floor(Date.now() / 1000);
                    header = {
                        alg: jwtAlgorithm(ks.cfg.type) || 'UnknownAlgorithm',
                        typ: 'JWT',
                        uav: '1.0.0' // actually 0.3.1 but server isn't updated yet
                    };
                    exp = currentTimeInSeconds + lifetimeInSeconds;
                    nbf = currentTimeInSeconds - 60;
                    if (proof) {
                        prf = decode(proof).payload;
                        exp = Math.min(prf.exp, exp);
                        nbf = Math.max(prf.nbf, nbf);
                    }
                    payload = {
                        aud: audience,
                        exp: exp,
                        fct: facts,
                        iss: issuer,
                        nbf: nbf,
                        prf: proof,
                        ptc: potency,
                        rsc: resource,
                    };
                    encodedHeader = base64.urlEncode(JSON.stringify(header));
                    encodedPayload = base64.urlEncode(JSON.stringify(payload));
                    return [4 /*yield*/, ks.sign(encodedHeader + "." + encodedPayload, { charSize: 8 })];
                case 2:
                    signed = _f.sent();
                    encodedSignature = base64.makeUrlSafe(signed);
                    // Make JWT
                    return [2 /*return*/, encodedHeader + '.' +
                            encodedPayload + '.' +
                            encodedSignature];
            }
        });
    });
}
/**
 * Given a list of UCANs, generate a dictionary.
 * The key will be in the form of `${resourceKey}:${resourceValue}`
 */
export function compileDictionary(ucans) {
    return ucans.reduce(function (acc, ucanString) {
        var _a, _b;
        var ucan = decode(ucanString);
        var rsc = ucan.payload.rsc;
        if (typeof rsc !== "object") {
            return __assign(__assign({}, acc), (_a = {}, _a[rsc] = ucan, _a));
        }
        var resource = Array.from(Object.entries(rsc))[0];
        var key = resource[0] + ":" + (resource[0] === WNFS_PREFIX
            ? resource[1].replace(/\/+$/, "")
            : resource[1]);
        return __assign(__assign({}, acc), (_b = {}, _b[key] = ucan, _b));
    }, {});
}
/**
 * Try to decode a UCAN.
 * Will throw if it fails.
 *
 * @param ucan The encoded UCAN to decode
 */
export function decode(ucan) {
    var split = ucan.split(".");
    var header = JSON.parse(base64.urlDecode(split[0]));
    var payload = JSON.parse(base64.urlDecode(split[1]));
    return {
        header: header,
        payload: payload,
        signature: split[2]
    };
}
/**
 * Encode a UCAN.
 *
 * @param ucan The UCAN to encode
 */
export function encode(ucan) {
    var encodedHeader = base64.urlEncode(JSON.stringify(ucan.header));
    var encodedPayload = base64.urlEncode(JSON.stringify(ucan.payload));
    return encodedHeader + '.' +
        encodedPayload + '.' +
        ucan.signature;
}
/**
 * Check if a UCAN is expired.
 *
 * @param ucan The UCAN to validate
 */
export function isExpired(ucan) {
    return ucan.payload.exp <= Math.floor(Date.now() / 1000);
}
/**
 * Given a UCAN, lookup the root issuer.
 *
 * Throws when given an improperly formatted UCAN.
 * This could be a nested UCAN (ie. proof).
 *
 * @param ucan A UCAN.
 * @returns The root issuer.
 */
export function rootIssuer(ucan, level) {
    if (level === void 0) { level = 0; }
    var p = extractPayload(ucan, level);
    if (p.prf)
        return rootIssuer(p.prf, level + 1);
    return p.iss;
}
// ㊙️
/**
 * JWT algorithm to be used in a JWT header.
 */
function jwtAlgorithm(cryptoSystem) {
    switch (cryptoSystem) {
        case CryptoSystem.RSA: return 'RS256';
        default: return null;
    }
}
/**
 * Extract the payload of a UCAN.
 *
 * Throws when given an improperly formatted UCAN.
 */
function extractPayload(ucan, level) {
    try {
        return JSON.parse(base64.urlDecode(ucan.split(".")[1]));
    }
    catch (_) {
        throw new Error("Invalid UCAN (" + level + " level" + (level === 1 ? "" : "s") + " deep): `" + ucan + "`");
    }
}
//# sourceMappingURL=ucan.js.map