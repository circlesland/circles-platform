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
import localforage from 'localforage';
import * as common from './common';
import * as keystore from './keystore';
import * as ucan from './ucan/internal';
import { READ_KEY_FROM_LOBBY_NAME, USERNAME_STORAGE_KEY } from './common';
import { loadFileSystem } from './filesystem';
import fsClass from './fs';
// SCENARIO
export var Scenario;
(function (Scenario) {
    Scenario["NotAuthorised"] = "NOT_AUTHORISED";
    Scenario["AuthSucceeded"] = "AUTH_SUCCEEDED";
    Scenario["AuthCancelled"] = "AUTH_CANCELLED";
    Scenario["Continuation"] = "CONTINUATION";
})(Scenario || (Scenario = {}));
// INTIALISE
/**
 * Check if we're authenticated, process any lobby query-parameters present in the URL,
 * and initiate the user's file system if authenticated (can be disabled).
 *
 * See `loadFileSystem` if you want to load the user's file system yourself.
 * NOTE: Only works on the main/ui thread, as it uses `window.location`.
 */
export function initialise(options) {
    return __awaiter(this, void 0, void 0, function () {
        var permissions, _a, autoRemoveUrlParams, _b, app, fs, maybeLoadFs, url, cancellation, ucans, newUser, encryptedReadKey, username, ks, readKey, _c, _d, c, authedUsername, _e, _f, _g;
        var _this = this;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    options = options || {};
                    permissions = options.permissions || null;
                    _a = options.autoRemoveUrlParams, autoRemoveUrlParams = _a === void 0 ? true : _a;
                    _b = permissions || {}, app = _b.app, fs = _b.fs;
                    maybeLoadFs = function (username) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(options.loadFileSystem === false)) return [3 /*break*/, 1];
                                    _a = undefined;
                                    return [3 /*break*/, 3];
                                case 1: return [4 /*yield*/, loadFileSystem(permissions, username)];
                                case 2:
                                    _a = _b.sent();
                                    _b.label = 3;
                                case 3: return [2 /*return*/, _a];
                            }
                        });
                    }); };
                    url = new URL(window.location.href);
                    cancellation = url.searchParams.get("cancelled");
                    ucans = url.searchParams.get("ucans");
                    // Add UCANs to the storage
                    return [4 /*yield*/, ucan.store(ucans ? ucans.split(",") : [])
                        // Determine scenario
                    ];
                case 1:
                    // Add UCANs to the storage
                    _h.sent();
                    if (!ucans) return [3 /*break*/, 7];
                    newUser = url.searchParams.get("newUser") === "t";
                    encryptedReadKey = url.searchParams.get("readKey") || "";
                    username = url.searchParams.get("username") || "";
                    return [4 /*yield*/, keystore.get()];
                case 2:
                    ks = _h.sent();
                    return [4 /*yield*/, ks.decrypt(common.base64.makeUrlUnsafe(encryptedReadKey))];
                case 3:
                    readKey = _h.sent();
                    return [4 /*yield*/, ks.importSymmKey(readKey, READ_KEY_FROM_LOBBY_NAME)];
                case 4:
                    _h.sent();
                    return [4 /*yield*/, localforage.setItem(USERNAME_STORAGE_KEY, username)];
                case 5:
                    _h.sent();
                    if (autoRemoveUrlParams) {
                        url.searchParams.delete("newUser");
                        url.searchParams.delete("readKey");
                        url.searchParams.delete("ucans");
                        url.searchParams.delete("username");
                        history.replaceState(null, document.title, url.toString());
                    }
                    if (permissions && ucan.validatePermissions(permissions, username) === false) {
                        return [2 /*return*/, scenarioNotAuthorised(permissions)];
                    }
                    _c = scenarioAuthSucceeded;
                    _d = [permissions,
                        newUser,
                        username];
                    return [4 /*yield*/, maybeLoadFs(username)];
                case 6: return [2 /*return*/, _c.apply(void 0, _d.concat([_h.sent()]))];
                case 7:
                    if (cancellation) {
                        c = (function (_) {
                            switch (cancellation) {
                                case "DENIED": return "User denied authorisation";
                                default: return "Unknown reason";
                            }
                        })();
                        return [2 /*return*/, scenarioAuthCancelled(permissions, c)];
                    }
                    _h.label = 8;
                case 8: return [4 /*yield*/, common.authenticatedUsername()];
                case 9:
                    authedUsername = _h.sent();
                    if (!(authedUsername &&
                        (permissions ? ucan.validatePermissions(permissions, authedUsername) : true))) return [3 /*break*/, 11];
                    _f = scenarioContinuation;
                    _g = [permissions, authedUsername];
                    return [4 /*yield*/, maybeLoadFs(authedUsername)];
                case 10:
                    _e = _f.apply(void 0, _g.concat([_h.sent()]));
                    return [3 /*break*/, 12];
                case 11:
                    _e = scenarioNotAuthorised(permissions);
                    _h.label = 12;
                case 12: return [2 /*return*/, _e];
            }
        });
    });
}
/**
 * Alias for `initialise`.
 */
export { initialise as initialize };
// EXPORT
export * from './auth';
export * from './filesystem';
export var fs = fsClass;
import * as apps_1 from './apps';
export { apps_1 as apps };
import * as dataRoot_1 from './data-root';
export { dataRoot_1 as dataRoot };
import * as did_1 from './did';
export { did_1 as did };
import * as errors_1 from './errors';
export { errors_1 as errors };
import * as lobby_1 from './lobby';
export { lobby_1 as lobby };
import * as setup_1 from './setup';
export { setup_1 as setup };
import * as ucan_1 from './ucan';
export { ucan_1 as ucan };
import * as dns_1 from './dns';
export { dns_1 as dns };
import * as ipfs_1 from './ipfs';
export { ipfs_1 as ipfs };
import * as keystore_1 from './keystore';
export { keystore_1 as keystore };
// ㊙️
function scenarioAuthSucceeded(permissions, newUser, username, fs) {
    return {
        scenario: Scenario.AuthSucceeded,
        permissions: permissions,
        authenticated: true,
        throughLobby: true,
        fs: fs,
        newUser: newUser,
        username: username
    };
}
function scenarioAuthCancelled(permissions, cancellationReason) {
    return {
        scenario: Scenario.AuthCancelled,
        permissions: permissions,
        authenticated: false,
        throughLobby: true,
        cancellationReason: cancellationReason
    };
}
function scenarioContinuation(permissions, username, fs) {
    return {
        scenario: Scenario.Continuation,
        permissions: permissions,
        authenticated: true,
        newUser: false,
        throughLobby: false,
        fs: fs,
        username: username
    };
}
function scenarioNotAuthorised(permissions) {
    return {
        scenario: Scenario.NotAuthorised,
        permissions: permissions,
        authenticated: false
    };
}
//# sourceMappingURL=index.js.map