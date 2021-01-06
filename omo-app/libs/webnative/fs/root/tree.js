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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { Branch } from '../types';
import { sha256Str } from '../../keystore';
import * as ipfs from '../../ipfs';
import * as link from '../link';
import * as protocol from '../protocol';
import * as semver from '../semver';
import BareTree from '../bare/tree';
import MMPT from '../protocol/private/mmpt';
import PublicTree from '../v1/PublicTree';
import PrivateTree from '../v1/PrivateTree';
var RootTree = /** @class */ (function () {
    function RootTree(_a) {
        var links = _a.links, mmpt = _a.mmpt, privateLog = _a.privateLog, publicTree = _a.publicTree, prettyTree = _a.prettyTree, privateTree = _a.privateTree;
        this.links = links;
        this.mmpt = mmpt;
        this.privateLog = privateLog;
        this.publicTree = publicTree;
        this.prettyTree = prettyTree;
        this.privateTree = privateTree;
    }
    // INITIALISATION
    // --------------
    RootTree.empty = function (_a) {
        var key = _a.key;
        return __awaiter(this, void 0, void 0, function () {
            var publicTree, prettyTree, mmpt, privateTree, tree;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, PublicTree.empty()];
                    case 1:
                        publicTree = _b.sent();
                        return [4 /*yield*/, BareTree.empty()];
                    case 2:
                        prettyTree = _b.sent();
                        mmpt = MMPT.create();
                        return [4 /*yield*/, PrivateTree.create(mmpt, key, null)];
                    case 3:
                        privateTree = _b.sent();
                        return [4 /*yield*/, privateTree.put()
                            // Construct tree
                        ];
                    case 4:
                        _b.sent();
                        tree = new RootTree({
                            links: {},
                            mmpt: mmpt,
                            privateLog: [],
                            publicTree: publicTree,
                            prettyTree: prettyTree,
                            privateTree: privateTree
                        });
                        // Set version and store new sub trees
                        tree.setVersion(semver.v1);
                        return [4 /*yield*/, Promise.all([
                                tree.updatePuttable(Branch.Public, publicTree),
                                tree.updatePuttable(Branch.Pretty, prettyTree),
                                tree.updatePuttable(Branch.Private, mmpt)
                            ])
                            // Fin
                        ];
                    case 5:
                        _b.sent();
                        // Fin
                        return [2 /*return*/, tree];
                }
            });
        });
    };
    RootTree.fromCID = function (_a) {
        var _b, _c, _d;
        var cid = _a.cid, key = _a.key;
        return __awaiter(this, void 0, void 0, function () {
            var links, publicCID, publicTree, _e, prettyTree, _f, privateCID, mmpt, privateTree, privateLogCid, privateLog, _g, tree;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        console.log("MuddaOida - " + Date.now() + ":  RootTree.fromCID(" + cid.toString() + ") -> await protocol.basic.getLinks(cid) ...");
                        return [4 /*yield*/, protocol.basic.getLinks(cid)
                            // Load public parts
                        ];
                    case 1:
                        links = _h.sent();
                        publicCID = ((_b = links[Branch.Public]) === null || _b === void 0 ? void 0 : _b.cid) || null;
                        console.log("MuddaOida - " + Date.now() + ":  RootTree.fromCID(" + cid.toString() + ") -> await PublicTree.fromCID(publicCID) ...");
                        if (!(publicCID === null)) return [3 /*break*/, 3];
                        return [4 /*yield*/, PublicTree.empty()];
                    case 2:
                        _e = _h.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, PublicTree.fromCID(publicCID)];
                    case 4:
                        _e = _h.sent();
                        _h.label = 5;
                    case 5:
                        publicTree = _e;
                        console.log("MuddaOida - " + Date.now() + ":  RootTree.fromCID(" + cid.toString() + ") -> await BareTree.fromCID(links[Branch.Pretty].cid) ...");
                        if (!links[Branch.Pretty]) return [3 /*break*/, 7];
                        return [4 /*yield*/, BareTree.fromCID(links[Branch.Pretty].cid)];
                    case 6:
                        _f = _h.sent();
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, BareTree.empty()
                        // Load private bits
                    ];
                    case 8:
                        _f = _h.sent();
                        _h.label = 9;
                    case 9:
                        prettyTree = _f;
                        privateCID = ((_c = links[Branch.Private]) === null || _c === void 0 ? void 0 : _c.cid) || null;
                        if (!(privateCID === null)) return [3 /*break*/, 12];
                        return [4 /*yield*/, MMPT.create()];
                    case 10:
                        mmpt = _h.sent();
                        console.log("MuddaOida - " + Date.now() + ":  RootTree.fromCID(" + cid.toString() + ") -> await PrivateTree.create(mmpt, key, null) ...");
                        return [4 /*yield*/, PrivateTree.create(mmpt, key, null)];
                    case 11:
                        privateTree = _h.sent();
                        return [3 /*break*/, 15];
                    case 12: return [4 /*yield*/, MMPT.fromCID(privateCID)];
                    case 13:
                        mmpt = _h.sent();
                        console.log("MuddaOida - " + Date.now() + ":  RootTree.fromCID(" + cid.toString() + ") -> await PrivateTree.fromBaseKey(mmpt, key) ...");
                        return [4 /*yield*/, PrivateTree.fromBaseKey(mmpt, key)];
                    case 14:
                        privateTree = _h.sent();
                        _h.label = 15;
                    case 15:
                        privateLogCid = (_d = links[Branch.PrivateLog]) === null || _d === void 0 ? void 0 : _d.cid;
                        console.log("MuddaOida - " + Date.now() + ":  RootTree.fromCID(" + cid.toString() + ") -> await ipfs.dagGet(privateLogCid) ...");
                        if (!privateLogCid) return [3 /*break*/, 17];
                        return [4 /*yield*/, ipfs.dagGet(privateLogCid)
                                .then(function (dagNode) { return dagNode.Links.map(link.fromDAGLink); })
                                .then(function (links) { return links.sort(function (a, b) {
                                return parseInt(a.name, 10) - parseInt(b.name, 10);
                            }); })];
                    case 16:
                        _g = _h.sent();
                        return [3 /*break*/, 18];
                    case 17:
                        _g = [];
                        _h.label = 18;
                    case 18:
                        privateLog = _g;
                        // Construct tree
                        console.log("MuddaOida - " + Date.now() + ":  RootTree.fromCID(" + cid.toString() + ") -> new RootTree ...");
                        tree = new RootTree({
                            links: links,
                            mmpt: mmpt,
                            privateLog: privateLog,
                            publicTree: publicTree,
                            prettyTree: prettyTree,
                            privateTree: privateTree
                        });
                        // Fin
                        console.log("MuddaOida - " + Date.now() + ":  RootTree.fromCID(" + cid.toString() + ") -> DONE");
                        return [2 /*return*/, tree];
                }
            });
        });
    };
    // MUTATIONS
    // ---------
    RootTree.prototype.put = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.putDetailed()];
                    case 1:
                        cid = (_a.sent()).cid;
                        return [2 /*return*/, cid];
                }
            });
        });
    };
    RootTree.prototype.putDetailed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, protocol.basic.putLinks(this.links)];
            });
        });
    };
    RootTree.prototype.updateLink = function (name, result) {
        var cid = result.cid, size = result.size, isFile = result.isFile;
        this.links[name] = link.make(name, cid, isFile, size);
        return this;
    };
    RootTree.prototype.updatePuttable = function (name, puttable) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.updateLink;
                        _b = [name];
                        return [4 /*yield*/, puttable.putDetailed()];
                    case 1: return [2 /*return*/, _a.apply(this, _b.concat([_c.sent()]))];
                }
            });
        });
    };
    RootTree.prototype.addPrivateLogEntry = function (cid) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var log, idx, lastChunk, _b, needsNewChunk, hashedCid, updatedChunk, updatedChunkDeposit, logDeposit, _c, _d;
            var _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        log = __spreadArrays(this.privateLog);
                        idx = Math.max(0, log.length - 1);
                        if (!((_a = log[idx]) === null || _a === void 0 ? void 0 : _a.cid)) return [3 /*break*/, 2];
                        return [4 /*yield*/, ipfs.cat(log[idx].cid)];
                    case 1:
                        _b = (_f.sent()).split(",");
                        return [3 /*break*/, 3];
                    case 2:
                        _b = [];
                        _f.label = 3;
                    case 3:
                        lastChunk = _b;
                        needsNewChunk = lastChunk.length + 1 > RootTree.LOG_CHUNK_SIZE;
                        if (needsNewChunk) {
                            idx = idx + 1;
                            lastChunk = [];
                        }
                        return [4 /*yield*/, sha256Str(cid)];
                    case 4:
                        hashedCid = _f.sent();
                        updatedChunk = __spreadArrays(lastChunk, [hashedCid]);
                        return [4 /*yield*/, protocol.basic.putFile(updatedChunk.join(","))];
                    case 5:
                        updatedChunkDeposit = _f.sent();
                        log[idx] = {
                            name: idx.toString(),
                            cid: updatedChunkDeposit.cid,
                            size: updatedChunkDeposit.size
                        };
                        return [4 /*yield*/, ipfs.dagPutLinks(log.map(link.toDAGLink))];
                    case 6:
                        logDeposit = _f.sent();
                        _c = this.updateLink;
                        _d = [Branch.PrivateLog];
                        _e = {
                            cid: logDeposit.cid,
                            isFile: false
                        };
                        return [4 /*yield*/, ipfs.size(logDeposit.cid)];
                    case 7:
                        _c.apply(this, _d.concat([(_e.size = _f.sent(),
                                _e)]));
                        this.privateLog = log;
                        return [2 /*return*/];
                }
            });
        });
    };
    // VERSION
    // -------
    RootTree.prototype.setVersion = function (version) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protocol.basic.putFile(semver.toString(version))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.updateLink(Branch.Version, result)];
                }
            });
        });
    };
    // PRIVATE LOG
    // -----------
    // CBOR array containing chunks.
    //
    // Chunk size is based on the default IPFS block size,
    // which is 1024 * 256 bytes. 1 log chunk should fit in 1 block.
    // We'll use the CSV format for the data in the chunks.
    RootTree.LOG_CHUNK_SIZE = 1020; // Math.floor((1024 * 256) / (256 + 1))
    return RootTree;
}());
export default RootTree;
//# sourceMappingURL=tree.js.map