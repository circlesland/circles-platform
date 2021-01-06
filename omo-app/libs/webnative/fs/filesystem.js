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
import { throttle } from 'throttle-debounce';
import { Branch } from './types';
import RootTree from './root/tree';
import PublicTree from './v1/PublicTree';
import PrivateTree from './v1/PrivateTree';
import * as cidLog from '../common/cid-log';
import * as dataRoot from '../data-root';
import * as debug from '../common/debug';
import * as keystore from '../keystore';
import * as pathUtil from './path';
import * as ucan from '../ucan';
import * as ucanInternal from '../ucan/internal';
import { get as getIpfs } from '../ipfs';
import { NoPermissionError } from '../errors';
// CLASS
var FileSystem = /** @class */ (function () {
    function FileSystem(_a) {
        var _this = this;
        var root = _a.root, permissions = _a.permissions, localOnly = _a.localOnly;
        this.localOnly = localOnly || false;
        this.proofs = {};
        this.publishHooks = [];
        this.publishWhenOnline = [];
        this.root = root;
        if (permissions &&
            permissions.app &&
            permissions.app.creator &&
            permissions.app.name) {
            this.appPath = appPath(permissions);
        }
        // Add the root CID of the file system to the CID log
        // (reverse list, newest cid first)
        var logCid = function (cid) {
            cidLog.add(cid);
            debug.log("📓 Adding to the CID ledger:", cid);
        };
        // Update the user's data root when making changes
        var updateDataRootWhenOnline = throttle(3000, false, function (cid, proof) {
            if (globalThis.navigator.onLine)
                return dataRoot.update(cid, proof);
            _this.publishWhenOnline.push([cid, proof]);
        }, false);
        this.publishHooks.push(logCid);
        this.publishHooks.push(updateDataRootWhenOnline);
        // Publish when coming back online
        globalThis.addEventListener('online', function () { return _this._whenOnline(); });
    }
    FileSystem.prototype.getIpfs = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getIpfs()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // INITIALISATION
    // --------------
    /**
     * Creates a file system with an empty public tree & an empty private tree at the root.
     */
    FileSystem.empty = function (opts) {
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, keyName, permissions, localOnly, key, root, fs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = opts.keyName, keyName = _a === void 0 ? 'filesystem-root' : _a, permissions = opts.permissions, localOnly = opts.localOnly;
                        return [4 /*yield*/, keystore.getKeyByName(keyName)];
                    case 1:
                        key = _b.sent();
                        return [4 /*yield*/, RootTree.empty({ key: key })];
                    case 2:
                        root = _b.sent();
                        fs = new FileSystem({
                            root: root,
                            permissions: permissions,
                            localOnly: localOnly
                        });
                        return [2 /*return*/, fs];
                }
            });
        });
    };
    /**
     * Loads an existing file system from a CID.
     */
    FileSystem.fromCID = function (cid, opts) {
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, keyName, permissions, localOnly, key, root, fs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.fromCID(" + cid.toString() + ") ...");
                        _a = opts.keyName, keyName = _a === void 0 ? 'filesystem-root' : _a, permissions = opts.permissions, localOnly = opts.localOnly;
                        return [4 /*yield*/, keystore.getKeyByName(keyName)];
                    case 1:
                        key = _b.sent();
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.fromCID(" + cid.toString() + ") -> await RootTree.fromCID({ cid, key }) ...");
                        return [4 /*yield*/, RootTree.fromCID({ cid: cid, key: key })];
                    case 2:
                        root = _b.sent();
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.fromCID(" + cid.toString() + ") -> new FileSystem ...");
                        fs = new FileSystem({
                            root: root,
                            permissions: permissions,
                            localOnly: localOnly
                        });
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.fromCID(" + cid.toString() + ") -> FINISHED");
                        return [2 /*return*/, fs];
                }
            });
        });
    };
    // DEACTIVATE
    // ----------
    /**
     * Deactivate a file system.
     *
     * Use this when a user signs out.
     * The only function of this is to stop listing to online/offline events.
     */
    FileSystem.prototype.deactivate = function () {
        globalThis.removeEventListener('online', this._whenOnline);
    };
    // POSIX INTERFACE
    // ---------------
    FileSystem.prototype.mkdir = function (path, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.mkdir(" + path + ") ...");
                        return [4 /*yield*/, this.runOnTree(path, true, function (tree, relPath) {
                                return tree.mkdir(relPath);
                            })];
                    case 1:
                        _a.sent();
                        if (!options.publish) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.publish()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.mkdir(" + path + ") -> DONE");
                        return [2 /*return*/, this];
                }
            });
        });
    };
    FileSystem.prototype.ls = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.ls(" + path + ") ...");
                        return [4 /*yield*/, this.runOnTree(path, false, function (tree, relPath) {
                                return tree.ls(relPath);
                            })];
                    case 1:
                        result = _a.sent();
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.ls(" + path + ") -> DONE");
                        return [2 /*return*/, result];
                }
            });
        });
    };
    FileSystem.prototype.add = function (path, content, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.add(" + path + ") ...");
                        return [4 /*yield*/, this.runOnTree(path, true, function (tree, relPath) {
                                return tree.add(relPath, content);
                            })];
                    case 1:
                        _a.sent();
                        if (!options.publish) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.publish()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.add(" + path + ") -> DONE");
                        return [2 /*return*/, this];
                }
            });
        });
    };
    FileSystem.prototype.cat = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.cat(" + path + ") ...");
                        return [4 /*yield*/, this.runOnTree(path, false, function (tree, relPath) {
                                return tree.cat(relPath);
                            })];
                    case 1:
                        result = _a.sent();
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.cat(" + path + ") -> DONE");
                        return [2 /*return*/, result];
                }
            });
        });
    };
    FileSystem.prototype.exists = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.exists(" + path + ") ...");
                        return [4 /*yield*/, this.runOnTree(path, false, function (tree, relPath) {
                                return tree.exists(relPath);
                            })];
                    case 1:
                        result = _a.sent();
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.exists(" + path + ") -> DONE");
                        return [2 /*return*/, result];
                }
            });
        });
    };
    FileSystem.prototype.rm = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.rm(" + path + ") ...");
                        return [4 /*yield*/, this.runOnTree(path, true, function (tree, relPath) {
                                return tree.rm(relPath);
                            })];
                    case 1:
                        _a.sent();
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.rm(" + path + ") -> DONE");
                        return [2 /*return*/, this];
                }
            });
        });
    };
    FileSystem.prototype.get = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.get(" + path + ") ...");
                        return [4 /*yield*/, this.runOnTree(path, false, function (tree, relPath) {
                                return tree.get(relPath);
                            })];
                    case 1:
                        result = _a.sent();
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.get(" + path + ") -> DONE");
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // This is only implemented on the same tree for now and will error otherwise
    FileSystem.prototype.mv = function (from, to) {
        return __awaiter(this, void 0, void 0, function () {
            var sameTree;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.mv(from:" + from + ", to:" + to + ") ...");
                        sameTree = pathUtil.sameParent(from, to);
                        if (!sameTree) {
                            throw new Error("`mv` is only supported on the same tree for now");
                        }
                        return [4 /*yield*/, this.runOnTree(from, true, function (tree, relPath) {
                                var nextPath = pathUtil.takeHead(to).nextPath;
                                return tree.mv(relPath, nextPath || '');
                            })];
                    case 1:
                        _a.sent();
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.mv(from:" + from + ", to:" + to + ") -> DONE");
                        return [2 /*return*/, this];
                }
            });
        });
    };
    FileSystem.prototype.read = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.cat(path)];
            });
        });
    };
    FileSystem.prototype.write = function (path, content, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.add(path, content, options)];
            });
        });
    };
    // PUBLISH
    // -------
    /**
     * Ensures the latest version of the file system is added to IPFS,
     * updates your data root, and returns the root CID.
     */
    FileSystem.prototype.publish = function () {
        return __awaiter(this, void 0, void 0, function () {
            var proofs, cid;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.publish() ...");
                        proofs = Array.from(Object.entries(this.proofs));
                        this.proofs = {};
                        return [4 /*yield*/, this.root.put()];
                    case 1:
                        cid = _a.sent();
                        proofs.forEach(function (_a) {
                            var _ = _a[0], proof = _a[1];
                            var encodedProof = ucan.encode(proof);
                            _this.publishHooks.forEach(function (hook) { return hook(cid, encodedProof); });
                        });
                        console.log("MuddaOida - " + Date.now() + ":  FileSystem.publish() -> DONE");
                        return [2 /*return*/, cid];
                }
            });
        });
    };
    // INTERNAL
    // --------
    /** @internal */
    FileSystem.prototype.runOnTree = function (path, isMutation, fn) {
        return __awaiter(this, void 0, void 0, function () {
            var parts, head, relPath, proof, result, resultPretty, cid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parts = pathUtil.splitParts(path);
                        head = parts[0];
                        relPath = pathUtil.join(parts.slice(1));
                        if (!!this.localOnly) return [3 /*break*/, 2];
                        return [4 /*yield*/, ucanInternal.lookupFilesystemUcan(path)];
                    case 1:
                        proof = _a.sent();
                        if (!proof || ucan.isExpired(proof)) {
                            throw new NoPermissionError("I don't have the necessary permissions to make these changes to the file system");
                        }
                        this.proofs[proof.signature] = proof;
                        _a.label = 2;
                    case 2:
                        if (!(head === Branch.Public)) return [3 /*break*/, 7];
                        return [4 /*yield*/, fn(this.root.publicTree, relPath)];
                    case 3:
                        result = _a.sent();
                        if (!(isMutation && PublicTree.instanceOf(result))) return [3 /*break*/, 6];
                        return [4 /*yield*/, fn(this.root.prettyTree, relPath)];
                    case 4:
                        resultPretty = _a.sent();
                        this.root.publicTree = result;
                        this.root.prettyTree = resultPretty;
                        return [4 /*yield*/, Promise.all([
                                this.root.updatePuttable(Branch.Public, this.root.publicTree),
                                this.root.updatePuttable(Branch.Pretty, this.root.prettyTree)
                            ])];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 17];
                    case 7:
                        if (!(head === Branch.Private)) return [3 /*break*/, 13];
                        return [4 /*yield*/, fn(this.root.privateTree, relPath)];
                    case 8:
                        result = _a.sent();
                        if (!(isMutation && PrivateTree.instanceOf(result))) return [3 /*break*/, 12];
                        this.root.privateTree = result;
                        return [4 /*yield*/, this.root.privateTree.put()];
                    case 9:
                        cid = _a.sent();
                        return [4 /*yield*/, this.root.updatePuttable(Branch.Private, this.root.mmpt)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, this.root.addPrivateLogEntry(cid)];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [3 /*break*/, 17];
                    case 13:
                        if (!(head === Branch.Pretty && isMutation)) return [3 /*break*/, 14];
                        throw new Error("The pretty path is read only");
                    case 14:
                        if (!(head === Branch.Pretty)) return [3 /*break*/, 16];
                        return [4 /*yield*/, fn(this.root.prettyTree, relPath)];
                    case 15:
                        result = _a.sent();
                        return [3 /*break*/, 17];
                    case 16: throw new Error("Not a valid FileSystem path");
                    case 17: return [2 /*return*/, result];
                }
            });
        });
    };
    /** @internal */
    FileSystem.prototype._whenOnline = function () {
        var _this = this;
        var toPublish = __spreadArrays(this.publishWhenOnline);
        this.publishWhenOnline = [];
        toPublish.forEach(function (_a) {
            var cid = _a[0], proof = _a[1];
            _this.publishHooks.forEach(function (hook) { return hook(cid, proof); });
        });
    };
    return FileSystem;
}());
export { FileSystem };
export default FileSystem;
// ㊙️
function appPath(permissions) {
    return function (path) { return (Branch.Private + "/Apps/"
        + (permissions.app ? permissions.app.creator + '/' : '')
        + (permissions.app ? permissions.app.name : '')
        + (path ? '/' + (typeof path == 'object' ? path.join('/') : path) : '')); };
}
//# sourceMappingURL=filesystem.js.map