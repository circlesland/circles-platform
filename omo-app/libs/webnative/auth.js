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
import * as cidLog from './common/cid-log';
import * as common from './common';
import * as did from './did';
import * as keystore from './keystore';
import * as ucan from './ucan/internal';
import { USERNAME_STORAGE_KEY } from './common';
import { setup } from './setup/internal';
// FUNCTIONS
/**
 * Retrieve the authenticated username.
 */
export function authenticatedUsername() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, common.authenticatedUsername()];
        });
    });
}
/**
 * Leave.
 *
 * Removes any trace of the user and redirects to the lobby.
 */
export function leave(_a) {
    var withoutRedirect = (_a === void 0 ? {} : _a).withoutRedirect;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, localforage.removeItem(USERNAME_STORAGE_KEY)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, ucan.clearStorage()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, cidLog.clear()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, keystore.clear()];
                case 4:
                    _b.sent();
                    if (!withoutRedirect && globalThis.location) {
                        globalThis.location.href = setup.endpoints.lobby;
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Redirects to a lobby.
 *
 * NOTE: Only works on the main thread, as it uses `window.location`.
 *
 * @param permissions The permissions from `initialise`.
 *                    Pass `null` if working without permissions.
 * @param redirectTo Specify the URL you want users to return to.
 *                   Uses the current url by default.
 */
export function redirectToLobby(permissions, redirectTo) {
    return __awaiter(this, void 0, void 0, function () {
        var app, fs, exchangeDid, writeDid, params;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = permissions ? permissions.app : undefined;
                    fs = permissions ? permissions.fs : undefined;
                    return [4 /*yield*/, did.exchange()];
                case 1:
                    exchangeDid = _a.sent();
                    return [4 /*yield*/, did.write()];
                case 2:
                    writeDid = _a.sent();
                    redirectTo = redirectTo || window.location.href;
                    params = [
                        ["didExchange", exchangeDid],
                        ["didWrite", writeDid],
                        ["redirectTo", redirectTo]
                    ].concat(app ? [["appFolder", app.creator + "/" + app.name]] : [], fs && fs.privatePaths ? fs.privatePaths.map(function (path) { return ["privatePath", path]; }) : [], fs && fs.publicPaths ? fs.publicPaths.map(function (path) { return ["publicPath", path]; }) : []);
                    // And, go!
                    window.location.href = setup.endpoints.lobby + "?" +
                        params
                            .map(function (_a) {
                            var k = _a[0], v = _a[1];
                            return encodeURIComponent(k) + "=" + encodeURIComponent(v);
                        })
                            .join("&");
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=auth.js.map