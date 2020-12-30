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
import * as protocol from '../protocol';
import * as check from '../types/check';
import BareFile from '../bare/file';
import BaseTree from '../base/tree';
import * as link from '../link';
import * as semver from '../semver';
import * as pathUtil from '../path';
var BareTree = /** @class */ (function (_super) {
    __extends(BareTree, _super);
    function BareTree(links) {
        var _this = _super.call(this, semver.v0) || this;
        _this.links = links;
        _this.children = {};
        return _this;
    }
    BareTree.empty = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new BareTree({})];
            });
        });
    };
    BareTree.fromCID = function (cid, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var links;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protocol.basic.getLinks(cid, timeout)];
                    case 1:
                        links = _a.sent();
                        return [2 /*return*/, new BareTree(links)];
                }
            });
        });
    };
    BareTree.fromLinks = function (links) {
        return new BareTree(links);
    };
    BareTree.prototype.createChildTree = function (name, onUpdate, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var child, existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, BareTree.empty()];
                    case 1:
                        child = _a.sent();
                        existing = this.children[name];
                        if (existing) {
                            if (BareFile.instanceOf(existing)) {
                                throw new Error("There is a file at the given path: " + name);
                            }
                            return [2 /*return*/, existing];
                        }
                        return [4 /*yield*/, this.updateDirectChild(child, name, onUpdate, timeout)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, child];
                }
            });
        });
    };
    BareTree.prototype.createOrUpdateChildFile = function (content, name, onUpdate, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, file;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDirectChild(name, timeout)];
                    case 1:
                        existing = _a.sent();
                        if (!(existing === null)) return [3 /*break*/, 3];
                        return [4 /*yield*/, BareFile.create(content)];
                    case 2:
                        file = _a.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        if (!BareFile.instanceOf(existing)) return [3 /*break*/, 5];
                        return [4 /*yield*/, existing.updateContent(content, timeout)];
                    case 4:
                        file = _a.sent();
                        return [3 /*break*/, 6];
                    case 5: throw new Error("There is already a directory with that name: " + name);
                    case 6: return [4 /*yield*/, this.updateDirectChild(file, name, onUpdate, timeout)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, file];
                }
            });
        });
    };
    BareTree.prototype.putDetailed = function (timeout) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, protocol.basic.putLinks(this.links, timeout)];
            });
        });
    };
    BareTree.prototype.putAndUpdateLink = function (child, name, onUpdate, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var details, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, child.putDetailed(timeout)];
                    case 1:
                        details = _b.sent();
                        this.updateLink(name, details);
                        _a = onUpdate;
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, onUpdate()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3:
                        _a;
                        return [2 /*return*/, this];
                }
            });
        });
    };
    BareTree.prototype.updateDirectChild = function (child, name, onUpdate, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.children[name] = child;
                return [2 /*return*/, this.putAndUpdateLink(child, name, onUpdate, timeout)];
            });
        });
    };
    BareTree.prototype.removeDirectChild = function (name) {
        delete this.links[name];
        if (this.children[name]) {
            delete this.children[name];
        }
        return this;
    };
    BareTree.prototype.getDirectChild = function (name, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var link, child, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.children[name]) {
                            return [2 /*return*/, this.children[name]];
                        }
                        link = this.links[name] || null;
                        if (link === null)
                            return [2 /*return*/, null];
                        if (!link.isFile) return [3 /*break*/, 2];
                        return [4 /*yield*/, BareFile.fromCID(link.cid, timeout)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, BareTree.fromCID(link.cid, timeout)
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
    BareTree.prototype.get = function (path, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, head, nextPath, nextTree;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = pathUtil.takeHead(path), head = _a.head, nextPath = _a.nextPath;
                        if (head === null)
                            return [2 /*return*/, this];
                        return [4 /*yield*/, this.getDirectChild(head, timeout)];
                    case 1:
                        nextTree = _b.sent();
                        if (nextPath === null) {
                            return [2 /*return*/, nextTree];
                        }
                        else if (nextTree === null || check.isFile(nextTree)) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, nextTree.get(nextPath, timeout)];
                }
            });
        });
    };
    BareTree.prototype.updateLink = function (name, result) {
        var cid = result.cid, size = result.size, isFile = result.isFile;
        this.links[name] = link.make(name, cid, isFile, size);
        return this;
    };
    BareTree.prototype.getLinks = function () {
        return this.links;
    };
    return BareTree;
}(BaseTree));
export default BareTree;
//# sourceMappingURL=tree.js.map