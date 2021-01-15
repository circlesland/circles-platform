var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import BaseTree from '../base/tree';
import PrivateFile from './PrivateFile';
import PrivateHistory from './PrivateHistory';
import { genKeyStr } from '../../keystore';
import { isObject, mapObj, removeKeyFromObj } from '../../common';
import * as check from '../protocol/private/types/check';
import * as metadata from '../metadata';
import * as namefilter from '../protocol/private/namefilter';
import * as pathUtil from '../path';
import * as protocol from '../protocol';
import * as semver from '../semver';
var PrivateTree = /** @class */ (function (_super) {
    __extends(PrivateTree, _super);
    function PrivateTree(_a) {
        var mmpt = _a.mmpt, key = _a.key, header = _a.header;
        var _this = _super.call(this, semver.v1) || this;
        _this.children = {};
        _this.header = header;
        _this.history = new PrivateHistory(_this);
        _this.key = key;
        _this.mmpt = mmpt;
        return _this;
    }
    PrivateTree.instanceOf = function (obj) {
        return isObject(obj)
            && obj.mmpt !== undefined
            && check.isPrivateTreeInfo(obj.header);
    };
    PrivateTree.create = function (mmpt, key, parentNameFilter) {
        return __awaiter(this, void 0, void 0, function () {
            var bareNameFilter, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!parentNameFilter) return [3 /*break*/, 2];
                        return [4 /*yield*/, namefilter.addToBare(parentNameFilter, key)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, namefilter.createBare(key)];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        bareNameFilter = _a;
                        return [2 /*return*/, new PrivateTree({
                                mmpt: mmpt,
                                key: key,
                                header: {
                                    metadata: metadata.empty(false),
                                    bareNameFilter: bareNameFilter,
                                    revision: 1,
                                    links: {},
                                    skeleton: {},
                                }
                            })];
                }
            });
        });
    };
    PrivateTree.fromBaseKey = function (mmpt, key) {
        return __awaiter(this, void 0, void 0, function () {
            var bareNameFilter, revisionFilter, name, info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, namefilter.createBare(key)];
                    case 1:
                        bareNameFilter = _a.sent();
                        return [4 /*yield*/, namefilter.addRevision(bareNameFilter, key, 1)];
                    case 2:
                        revisionFilter = _a.sent();
                        return [4 /*yield*/, namefilter.toPrivateName(revisionFilter)];
                    case 3:
                        name = _a.sent();
                        return [4 /*yield*/, protocol.priv.getByLatestName(mmpt, name, key)];
                    case 4:
                        info = _a.sent();
                        if (!check.isPrivateTreeInfo(info)) {
                            throw new Error("Could not parse a valid private tree using the given key");
                        }
                        return [2 /*return*/, new PrivateTree({ mmpt: mmpt, key: key, header: info })];
                }
            });
        });
    };
    PrivateTree.fromName = function (mmpt, name, key) {
        return __awaiter(this, void 0, void 0, function () {
            var info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protocol.priv.getByName(mmpt, name, key)];
                    case 1:
                        info = _a.sent();
                        if (!check.isPrivateTreeInfo(info)) {
                            throw new Error("Could not parse a valid private tree using the given key");
                        }
                        return [2 /*return*/, new PrivateTree({ mmpt: mmpt, key: key, header: info })];
                }
            });
        });
    };
    PrivateTree.fromInfo = function (mmpt, key, info) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new PrivateTree({ mmpt: mmpt, key: key, header: info })];
            });
        });
    };
    PrivateTree.prototype.createChildTree = function (name, onUpdate) {
        return __awaiter(this, void 0, void 0, function () {
            var key, child, existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, genKeyStr()];
                    case 1:
                        key = _a.sent();
                        return [4 /*yield*/, PrivateTree.create(this.mmpt, key, this.header.bareNameFilter)];
                    case 2:
                        child = _a.sent();
                        existing = this.children[name];
                        if (existing) {
                            if (PrivateFile.instanceOf(existing)) {
                                throw new Error("There is a file at the given path: " + name);
                            }
                            return [2 /*return*/, existing];
                        }
                        return [4 /*yield*/, this.updateDirectChild(child, name, onUpdate)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, child];
                }
            });
        });
    };
    PrivateTree.prototype.createOrUpdateChildFile = function (content, name, onUpdate) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, file, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDirectChild(name)];
                    case 1:
                        existing = _a.sent();
                        if (!(existing === null)) return [3 /*break*/, 4];
                        return [4 /*yield*/, genKeyStr()];
                    case 2:
                        key = _a.sent();
                        return [4 /*yield*/, PrivateFile.create(this.mmpt, content, this.header.bareNameFilter, key)];
                    case 3:
                        file = _a.sent();
                        return [3 /*break*/, 7];
                    case 4:
                        if (!PrivateFile.instanceOf(existing)) return [3 /*break*/, 6];
                        return [4 /*yield*/, existing.updateContent(content)];
                    case 5:
                        file = _a.sent();
                        return [3 /*break*/, 7];
                    case 6: throw new Error("There is already a directory with that name: " + name);
                    case 7: return [4 /*yield*/, this.updateDirectChild(file, name, onUpdate)];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, file];
                }
            });
        });
    };
    PrivateTree.prototype.putDetailed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var nodeCopy;
            return __generator(this, function (_a) {
                nodeCopy = Object.assign({}, this.header);
                return [2 /*return*/, protocol.priv.addNode(this.mmpt, nodeCopy, this.key)];
            });
        });
    };
    PrivateTree.prototype.updateDirectChild = function (child, name, onUpdate) {
        return __awaiter(this, void 0, void 0, function () {
            var details, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, child.updateParentNameFilter(this.header.bareNameFilter)];
                    case 1:
                        _b.sent();
                        this.children[name] = child;
                        return [4 /*yield*/, child.putDetailed()];
                    case 2:
                        details = _b.sent();
                        this.updateLink(name, details);
                        _a = onUpdate;
                        if (!_a) return [3 /*break*/, 4];
                        return [4 /*yield*/, onUpdate()];
                    case 3:
                        _a = (_b.sent());
                        _b.label = 4;
                    case 4:
                        _a;
                        return [2 /*return*/, this];
                }
            });
        });
    };
    PrivateTree.prototype.removeDirectChild = function (name) {
        this.header = __assign(__assign({}, this.header), { revision: this.header.revision + 1, links: removeKeyFromObj(this.header.links, name), skeleton: removeKeyFromObj(this.header.skeleton, name) });
        if (this.children[name]) {
            delete this.children[name];
        }
        return this;
    };
    PrivateTree.prototype.getDirectChild = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var childInfo, child, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.children[name]) {
                            return [2 /*return*/, this.children[name]];
                        }
                        childInfo = this.header.links[name];
                        if (childInfo === undefined)
                            return [2 /*return*/, null];
                        if (!childInfo.isFile) return [3 /*break*/, 2];
                        return [4 /*yield*/, PrivateFile.fromName(this.mmpt, childInfo.pointer, childInfo.key)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, PrivateTree.fromName(this.mmpt, childInfo.pointer, childInfo.key)
                        // check that the child wasn't added while retrieving the content from the network
                    ];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        child = _a;
                        // check that the child wasn't added while retrieving the content from the network
                        if (this.children[name]) {
                            return [2 /*return*/, this.children[name]];
                        }
                        this.children[name] = child;
                        return [2 /*return*/, child];
                }
            });
        });
    };
    PrivateTree.prototype.getName = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, bareNameFilter, revision, revisionFilter;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.header, bareNameFilter = _a.bareNameFilter, revision = _a.revision;
                        return [4 /*yield*/, namefilter.addRevision(bareNameFilter, this.key, revision)];
                    case 1:
                        revisionFilter = _b.sent();
                        return [2 /*return*/, namefilter.toPrivateName(revisionFilter)];
                }
            });
        });
    };
    PrivateTree.prototype.updateParentNameFilter = function (parentNameFilter) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.header;
                        return [4 /*yield*/, namefilter.addToBare(parentNameFilter, this.key)];
                    case 1:
                        _a.bareNameFilter = _b.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    PrivateTree.prototype.get = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var parts, head, rest, next, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parts = pathUtil.splitParts(path);
                        if (parts.length === 0)
                            return [2 /*return*/, this];
                        head = parts[0], rest = parts.slice(1);
                        next = this.header.skeleton[head];
                        if (next === undefined)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.getRecurse(next, rest)];
                    case 1:
                        result = _a.sent();
                        if (result === null)
                            return [2 /*return*/, null];
                        return [2 /*return*/, check.isPrivateFileInfo(result.node)
                                ? PrivateFile.fromInfo(this.mmpt, result.key, result.node)
                                : PrivateTree.fromInfo(this.mmpt, result.key, result.node)];
                }
            });
        });
    };
    PrivateTree.prototype.getRecurse = function (nodeInfo, parts) {
        return __awaiter(this, void 0, void 0, function () {
            var head, rest, nextChild, reloadedNode, reloadedNext;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        head = parts[0], rest = parts.slice(1);
                        if (!(head === undefined)) return [3 /*break*/, 2];
                        _a = {
                            key: nodeInfo.key
                        };
                        return [4 /*yield*/, protocol.priv.getByCID(nodeInfo.cid, nodeInfo.key)];
                    case 1: return [2 /*return*/, (_a.node = _b.sent(),
                            _a)];
                    case 2:
                        nextChild = nodeInfo.subSkeleton[head];
                        if (nextChild !== undefined) {
                            return [2 /*return*/, this.getRecurse(nextChild, rest)];
                        }
                        return [4 /*yield*/, protocol.priv.getByCID(nodeInfo.cid, nodeInfo.key)];
                    case 3:
                        reloadedNode = _b.sent();
                        if (!check.isPrivateTreeInfo(reloadedNode)) {
                            return [2 /*return*/, null];
                        }
                        reloadedNext = reloadedNode.skeleton[head];
                        return [2 /*return*/, reloadedNext === undefined ? null : this.getRecurse(reloadedNext, rest)];
                }
            });
        });
    };
    PrivateTree.prototype.getLinks = function () {
        return mapObj(this.header.links, function (link) {
            var key = link.key, rest = __rest(link, ["key"]);
            return __assign({}, rest);
        });
    };
    PrivateTree.prototype.updateLink = function (name, result) {
        var cid = result.cid, size = result.size, key = result.key, isFile = result.isFile, skeleton = result.skeleton;
        var pointer = result.name;
        this.header.links[name] = { name: name, key: key, pointer: pointer, size: size, isFile: isFile, mtime: Date.now() };
        this.header.skeleton[name] = { cid: cid, key: key, subSkeleton: skeleton };
        this.header.revision = this.header.revision + 1;
        this.header.metadata.unixMeta.mtime = Date.now();
        return this;
    };
    return PrivateTree;
}(BaseTree));
export default PrivateTree;
//# sourceMappingURL=PrivateTree.js.map