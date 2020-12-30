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
import * as ipfs from "../../../ipfs";
import * as check from './types/check';
import * as namefilter from './namefilter';
import * as basic from '../basic';
export var addNode = function (mmpt, node, key, timeout) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, cid, size, filter, name, contentBareFilter, contentFilter, contentName, _b, skeleton, isFile;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, basic.putEncryptedFile(node, key, timeout)];
            case 1:
                _a = _c.sent(), cid = _a.cid, size = _a.size;
                return [4 /*yield*/, namefilter.addRevision(node.bareNameFilter, key, node.revision)];
            case 2:
                filter = _c.sent();
                return [4 /*yield*/, namefilter.toPrivateName(filter)];
            case 3:
                name = _c.sent();
                return [4 /*yield*/, mmpt.add(name, cid, timeout)
                    // if the node is a file, we also add the content to the MMPT
                ];
            case 4:
                _c.sent();
                if (!check.isPrivateFileInfo(node)) return [3 /*break*/, 9];
                return [4 /*yield*/, namefilter.addToBare(node.bareNameFilter, node.key)];
            case 5:
                contentBareFilter = _c.sent();
                return [4 /*yield*/, namefilter.addRevision(contentBareFilter, node.key, node.revision)];
            case 6:
                contentFilter = _c.sent();
                return [4 /*yield*/, namefilter.toPrivateName(contentFilter)];
            case 7:
                contentName = _c.sent();
                return [4 /*yield*/, mmpt.add(contentName, node.content, timeout)];
            case 8:
                _c.sent();
                _c.label = 9;
            case 9:
                _b = check.isPrivateFileInfo(node) ? [{}, true] : [node.skeleton, false], skeleton = _b[0], isFile = _b[1];
                return [2 /*return*/, { cid: cid, name: name, key: key, size: size, isFile: isFile, skeleton: skeleton }];
        }
    });
}); };
export var readNode = function (cid, key, timeout) { return __awaiter(void 0, void 0, void 0, function () {
    var content;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ipfs.encoded.catAndDecode(cid, key, timeout)];
            case 1:
                content = _a.sent();
                if (!check.isDecryptedNode(content)) {
                    throw new Error("Could not parse a valid filesystem object, " + cid);
                }
                return [2 /*return*/, content];
        }
    });
}); };
export var getByName = function (mmpt, name, key, timeout) { return __awaiter(void 0, void 0, void 0, function () {
    var cid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mmpt.get(name, timeout)];
            case 1:
                cid = _a.sent();
                if (cid === null)
                    return [2 /*return*/, null];
                return [2 /*return*/, getByCID(cid, key, timeout)];
        }
    });
}); };
export var getByCID = function (cid, key, timeout) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, readNode(cid, key, timeout)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
export var getByLatestName = function (mmpt, name, key, timeout) { return __awaiter(void 0, void 0, void 0, function () {
    var cid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mmpt.get(name, timeout)];
            case 1:
                cid = _a.sent();
                if (cid === null)
                    return [2 /*return*/, null];
                return [2 /*return*/, getLatestByCID(mmpt, cid, key, timeout)];
        }
    });
}); };
export var getLatestByCID = function (mmpt, cid, key, timeout) { return __awaiter(void 0, void 0, void 0, function () {
    var node, latest, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, getByCID(cid, key, timeout)];
            case 1:
                node = _b.sent();
                return [4 /*yield*/, findLatestRevision(mmpt, node.bareNameFilter, key, node.revision, timeout)];
            case 2:
                latest = _b.sent();
                if (!(latest === null || latest === void 0 ? void 0 : latest.cid)) return [3 /*break*/, 4];
                return [4 /*yield*/, getByCID(latest === null || latest === void 0 ? void 0 : latest.cid, key, timeout)];
            case 3:
                _a = _b.sent();
                return [3 /*break*/, 5];
            case 4:
                _a = node;
                _b.label = 5;
            case 5: return [2 /*return*/, _a];
        }
    });
}); };
export var findLatestRevision = function (mmpt, bareName, key, lastKnownRevision, timeout) { return __awaiter(void 0, void 0, void 0, function () {
    var lowerBound, upperBound, i, lastRevision, toCheck, thisRevision, midpoint, thisRevision;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                lowerBound = lastKnownRevision, upperBound = null;
                i = 0;
                lastRevision = null;
                _a.label = 1;
            case 1:
                if (!(upperBound === null)) return [3 /*break*/, 3];
                toCheck = lastKnownRevision + Math.pow(2, i);
                return [4 /*yield*/, getRevision(mmpt, bareName, key, toCheck, timeout)];
            case 2:
                thisRevision = _a.sent();
                if (thisRevision !== null) {
                    lastRevision = thisRevision;
                    lowerBound = toCheck;
                }
                else {
                    upperBound = toCheck;
                }
                i++;
                return [3 /*break*/, 1];
            case 3:
                if (!(lowerBound < (upperBound - 1))) return [3 /*break*/, 5];
                midpoint = Math.floor((upperBound + lowerBound) / 2);
                return [4 /*yield*/, getRevision(mmpt, bareName, key, midpoint, timeout)];
            case 4:
                thisRevision = _a.sent();
                if (thisRevision !== null) {
                    lastRevision = thisRevision;
                    lowerBound = midpoint;
                }
                else {
                    upperBound = midpoint;
                }
                return [3 /*break*/, 3];
            case 5: return [2 /*return*/, lastRevision];
        }
    });
}); };
export var getRevision = function (mmpt, bareName, key, revision, timeout) { return __awaiter(void 0, void 0, void 0, function () {
    var filter, name, cid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, namefilter.addRevision(bareName, key, revision)];
            case 1:
                filter = _a.sent();
                return [4 /*yield*/, namefilter.toPrivateName(filter)];
            case 2:
                name = _a.sent();
                return [4 /*yield*/, mmpt.get(name, timeout)];
            case 3:
                cid = _a.sent();
                return [2 /*return*/, cid ? { cid: cid, name: name, number: revision } : null];
        }
    });
}); };
//# sourceMappingURL=index.js.map