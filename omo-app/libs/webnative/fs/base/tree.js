/** @internal */
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
/** @internal */
import * as pathUtil from '../path';
import * as check from '../types/check';
var BaseTree = /** @class */ (function () {
    function BaseTree(version) {
        this.version = version;
    }
    BaseTree.prototype.put = function () {
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
    BaseTree.prototype.ls = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var dir;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get(path)];
                    case 1:
                        dir = _a.sent();
                        if (dir === null) {
                            throw new Error("Path does not exist");
                        }
                        else if (check.isFile(dir)) {
                            throw new Error('Can not `ls` a file');
                        }
                        return [2 /*return*/, dir.getLinks()];
                }
            });
        });
    };
    BaseTree.prototype.cat = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var file;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get(path)];
                    case 1:
                        file = _a.sent();
                        if (file === null) {
                            throw new Error("Path does not exist");
                        }
                        else if (!check.isFile(file)) {
                            throw new Error('Can not `cat` a directory');
                        }
                        return [2 /*return*/, file.content];
                }
            });
        });
    };
    BaseTree.prototype.mkdir = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.mkdirRecurse(path, function () { return _this.put(); })];
            });
        });
    };
    BaseTree.prototype.mkdirRecurse = function (path, onUpdate) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, head, nextPath, child;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = pathUtil.takeHead(path), head = _a.head, nextPath = _a.nextPath;
                        if (head === null) {
                            throw new Error("Invalid path: empty");
                        }
                        return [4 /*yield*/, this.getOrCreateDirectChild(head, onUpdate)];
                    case 1:
                        child = _b.sent();
                        if (check.isFile(child)) {
                            throw new Error("There is a file along the given path: " + path);
                        }
                        if (!(nextPath !== null)) return [3 /*break*/, 3];
                        return [4 /*yield*/, child.mkdirRecurse(nextPath, function () { return _this.updateDirectChild(child, head, onUpdate); })];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/, this];
                }
            });
        });
    };
    BaseTree.prototype.add = function (path, content) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addRecurse(path, content, function () { return _this.put(); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    BaseTree.prototype.addRecurse = function (path, content, onUpdate) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, head, nextPath, child_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = pathUtil.takeHead(path), head = _a.head, nextPath = _a.nextPath;
                        if (head === null) {
                            throw new Error("Invalid path: empty");
                        }
                        if (!(nextPath === null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createOrUpdateChildFile(content, head, onUpdate)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 2: return [4 /*yield*/, this.getOrCreateDirectChild(head, onUpdate)];
                    case 3:
                        child_1 = _b.sent();
                        if (check.isFile(child_1)) {
                            throw new Error("There is a file along the given path: " + path);
                        }
                        return [4 /*yield*/, child_1.addRecurse(nextPath, content, function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.updateDirectChild(child_1, head, onUpdate)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [2 /*return*/, this];
                }
            });
        });
    };
    BaseTree.prototype.rm = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rmRecurse(path, function () { return _this.put(); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    BaseTree.prototype.rmRecurse = function (path, onUpdate) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, head, nextPath, _b, child_2;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = pathUtil.takeHead(path), head = _a.head, nextPath = _a.nextPath;
                        if (head === null) {
                            throw new Error("Invalid path: empty");
                        }
                        if (!(nextPath === null)) return [3 /*break*/, 3];
                        this.removeDirectChild(head);
                        _b = onUpdate;
                        if (!_b) return [3 /*break*/, 2];
                        return [4 /*yield*/, onUpdate()];
                    case 1:
                        _b = (_c.sent());
                        _c.label = 2;
                    case 2:
                        _b;
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, this.getDirectChild(head)];
                    case 4:
                        child_2 = _c.sent();
                        if (child_2 === null) {
                            throw new Error("Invalid path: does not exist");
                        }
                        else if (check.isFile(child_2)) {
                            throw new Error("There is a file along the given path: " + path);
                        }
                        return [4 /*yield*/, child_2.rmRecurse(nextPath, function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.updateDirectChild(child_2, head, onUpdate)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6: return [2 /*return*/, this];
                }
            });
        });
    };
    BaseTree.prototype.mv = function (from, to) {
        return __awaiter(this, void 0, void 0, function () {
            var node, _a, tail, parentPath, parent, toParts;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.get(from)];
                    case 1:
                        node = _b.sent();
                        if (node === null) {
                            throw new Error("Path does not exist: " + from);
                        }
                        _a = pathUtil.takeTail(to), tail = _a.tail, parentPath = _a.parentPath;
                        parentPath = parentPath || '';
                        if (tail === null) {
                            throw new Error("Path does not exist: " + to);
                        }
                        return [4 /*yield*/, this.get(parentPath)];
                    case 2:
                        parent = _b.sent();
                        if (!!parent) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.mkdir(parentPath)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.get(parentPath)];
                    case 4:
                        parent = _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        if (check.isFile(parent)) {
                            throw new Error("Can not `mv` to a file: " + parentPath);
                        }
                        _b.label = 6;
                    case 6:
                        toParts = pathUtil.splitParts(to);
                        return [4 /*yield*/, this.rm(from)];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, __spreadArrays(toParts).reverse().reduce(function (acc, part, idx) {
                                return acc.then(function (child) { return __awaiter(_this, void 0, void 0, function () {
                                    var childParentParts, tree, _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                childParentParts = toParts.slice(0, -(idx + 1));
                                                if (!childParentParts.length) return [3 /*break*/, 2];
                                                return [4 /*yield*/, this.get(pathUtil.join(childParentParts))];
                                            case 1:
                                                _a = _b.sent();
                                                return [3 /*break*/, 3];
                                            case 2:
                                                _a = this;
                                                _b.label = 3;
                                            case 3:
                                                tree = _a;
                                                if (!(tree && !check.isFile(tree))) return [3 /*break*/, 5];
                                                return [4 /*yield*/, tree.updateDirectChild(child, part, null)];
                                            case 4:
                                                _b.sent();
                                                return [2 /*return*/, tree];
                                            case 5: throw new Error("Failed to update tree while moving node");
                                        }
                                    });
                                }); });
                            }, Promise.resolve(node))];
                    case 8:
                        _b.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    BaseTree.prototype.exists = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var node;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get(path)];
                    case 1:
                        node = _a.sent();
                        return [2 /*return*/, node !== null];
                }
            });
        });
    };
    BaseTree.prototype.read = function (path) {
        return this.get(path);
    };
    BaseTree.prototype.write = function (path, content) {
        return this.add(path, content);
    };
    BaseTree.prototype.getOrCreateDirectChild = function (name, onUpdate) {
        return __awaiter(this, void 0, void 0, function () {
            var node;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDirectChild(name)];
                    case 1:
                        node = _a.sent();
                        return [2 /*return*/, node !== null
                                ? node
                                : this.createChildTree(name, onUpdate)];
                }
            });
        });
    };
    return BaseTree;
}());
export default BaseTree;
//# sourceMappingURL=tree.js.map