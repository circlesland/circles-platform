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
import FileSystem from './fs';
import * as cidLog from './common/cid-log';
import * as debug from './common/debug';
import * as dataRoot from './data-root';
import * as ucan from './ucan/internal';
import { READ_KEY_FROM_LOBBY_NAME, authenticatedUsername } from './common';
/**
 * Load a user's file system.
 *
 * @param permissions The permissions from initialise.
 *                    Pass `null` if working without permissions
 * @param username Optional, username of the user to load the file system from.
 *                 Will try to load the file system of the authenticated user
 *                 by default. Throws an error if there's no authenticated user.
 */
export function loadFileSystem(permissions, username) {
    return __awaiter(this, void 0, void 0, function () {
        var cid, fs, _a, dataCid, _b, _c, logIdx, logLength, _d, idxLog, keyName, p, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = username;
                    if (_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, authenticatedUsername()];
                case 1:
                    _a = ((_f.sent()) || undefined);
                    _f.label = 2;
                case 2:
                    // Look for username
                    username = _a;
                    if (!username)
                        throw new Error("User hasn't authenticated yet");
                    // Ensure internal UCAN dictionary
                    return [4 /*yield*/, ucan.store([])
                        // Determine the correct CID of the file system to load
                    ];
                case 3:
                    // Ensure internal UCAN dictionary
                    _f.sent();
                    if (!navigator.onLine) return [3 /*break*/, 5];
                    return [4 /*yield*/, dataRoot.lookup(username)];
                case 4:
                    _b = _f.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _b = null;
                    _f.label = 6;
                case 6:
                    dataCid = _b;
                    if (!dataCid) return [3 /*break*/, 8];
                    return [4 /*yield*/, cidLog.index(dataCid)];
                case 7:
                    _d = _f.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _d = [-1, 0];
                    _f.label = 9;
                case 9:
                    _c = _d, logIdx = _c[0], logLength = _c[1];
                    if (!!navigator.onLine) return [3 /*break*/, 11];
                    return [4 /*yield*/, cidLog.newest()];
                case 10:
                    // Offline, use local CID
                    cid = _f.sent();
                    return [3 /*break*/, 18];
                case 11:
                    if (!!dataCid) return [3 /*break*/, 13];
                    return [4 /*yield*/, cidLog.newest()];
                case 12:
                    // No DNS CID yet
                    cid = _f.sent();
                    if (cid)
                        debug.log("📓 No DNSLink, using local CID:", cid);
                    else
                        debug.log("📓 Creating a new file system");
                    return [3 /*break*/, 18];
                case 13:
                    if (!(logIdx === 0)) return [3 /*break*/, 14];
                    // DNS is up to date
                    cid = dataCid;
                    debug.log("📓 DNSLink is up to date:", cid);
                    return [3 /*break*/, 18];
                case 14:
                    if (!(logIdx > 0)) return [3 /*break*/, 16];
                    return [4 /*yield*/, cidLog.newest()];
                case 15:
                    // DNS is outdated
                    cid = _f.sent();
                    idxLog = logIdx === 1 ? "1 newer local entry" : logIdx + " newer local entries";
                    debug.log("📓 DNSLink is outdated (" + idxLog + "), using local CID:", cid);
                    return [3 /*break*/, 18];
                case 16:
                    // DNS is newer
                    cid = dataCid;
                    return [4 /*yield*/, cidLog.add(cid)];
                case 17:
                    _f.sent();
                    debug.log("📓 DNSLink is newer:", cid);
                    _f.label = 18;
                case 18:
                    keyName = READ_KEY_FROM_LOBBY_NAME;
                    p = permissions || undefined;
                    if (!cid) return [3 /*break*/, 20];
                    return [4 /*yield*/, FileSystem.fromCID(cid, { keyName: keyName, permissions: p })];
                case 19:
                    _e = _f.sent();
                    return [3 /*break*/, 21];
                case 20:
                    _e = null;
                    _f.label = 21;
                case 21:
                    fs = _e;
                    if (fs)
                        return [2 /*return*/, fs
                            // Otherwise make a new one
                        ];
                    return [4 /*yield*/, FileSystem.empty({ keyName: keyName, permissions: p })];
                case 22:
                    // Otherwise make a new one
                    fs = _f.sent();
                    return [4 /*yield*/, addSampleData(fs)
                        // Fin
                    ];
                case 23:
                    _f.sent();
                    // Fin
                    return [2 /*return*/, fs];
            }
        });
    });
}
// ㊙️
function addSampleData(fs) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.mkdir("private/Apps")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs.mkdir("private/Audio")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fs.mkdir("private/Documents")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, fs.mkdir("private/Photos")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, fs.mkdir("private/Video")];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, fs.publish()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=filesystem.js.map