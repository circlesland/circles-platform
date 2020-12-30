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
import * as basic from '../basic';
import * as link from '../../link';
var nibbles = { "0": true, "1": true, "2": true, "3": true, "4": true, "5": true, "6": true, "7": true,
    "8": true, "9": true, "a": true, "b": true, "c": true, "d": true, "e": true, "f": true,
};
var isNibble = function (str) { return nibbles[str] === true; };
/**
 * Modified Merkle Patricia Tree
 * The tree has a node weight of 16
 * It stores items with hexidecimal keys and creates a new layer when a given layer has two keys that start with the same nibble
 */
var MMPT = /** @class */ (function () {
    function MMPT(links) {
        this.links = links;
        this.children = {};
    }
    MMPT.create = function () {
        return new MMPT({});
    };
    MMPT.fromCID = function (cid, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var links;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, basic.getSimpleLinks(cid, timeout)];
                    case 1:
                        links = _a.sent();
                        return [2 /*return*/, new MMPT(links)];
                }
            });
        });
    };
    MMPT.prototype.putDetailed = function (timeout) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, basic.putLinks(this.links, timeout)];
            });
        });
    };
    MMPT.prototype.put = function (timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var cid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.putDetailed(timeout)];
                    case 1:
                        cid = (_a.sent()).cid;
                        return [2 /*return*/, cid];
                }
            });
        });
    };
    MMPT.prototype.add = function (name, value, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var nextNameOrSib, nextTree, newTree, nextCID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!isNibble(name[0])) {
                            throw new Error("Not a valid name, must be hexadecimal");
                        }
                        nextNameOrSib = this.nextTreeOrSiblingName(name);
                        if (!(name === nextNameOrSib)) return [3 /*break*/, 1];
                        return [3 /*break*/, 9];
                    case 1:
                        if (!(nextNameOrSib === null)) return [3 /*break*/, 2];
                        this.links[name] = link.make(name, value, true, 0);
                        return [3 /*break*/, 9];
                    case 2:
                        if (!(nextNameOrSib.length === 1)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getDirectChild(nextNameOrSib, timeout)];
                    case 3:
                        nextTree = _a.sent();
                        return [4 /*yield*/, nextTree.add(name.slice(1), value, timeout)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.putAndUpdateLink(nextNameOrSib, nextTree, timeout)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 6:
                        newTree = this.addEmptyChild(name[0]);
                        nextCID = this.links[nextNameOrSib].cid;
                        this.removeChild(nextNameOrSib);
                        return [4 /*yield*/, Promise.all([
                                newTree.add(name.slice(1), value, timeout),
                                newTree.add(nextNameOrSib.slice(1), nextCID, timeout)
                            ])];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.putAndUpdateLink(name[0], newTree, timeout)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    MMPT.prototype.putAndUpdateLink = function (name, child, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, cid, size;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, child.putDetailed(timeout)];
                    case 1:
                        _a = _b.sent(), cid = _a.cid, size = _a.size;
                        this.links[name] = link.make(name, cid, false, size);
                        return [2 /*return*/];
                }
            });
        });
    };
    MMPT.prototype.addEmptyChild = function (name) {
        var tree = MMPT.create();
        this.children[name] = tree;
        return tree;
    };
    MMPT.prototype.get = function (name, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var nextName, nextTree;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nextName = this.nextTreeName(name);
                        if (nextName === null)
                            return [2 /*return*/, null];
                        if (nextName.length > 1) {
                            return [2 /*return*/, this.links[nextName].cid];
                        }
                        return [4 /*yield*/, this.getDirectChild(nextName, timeout)];
                    case 1:
                        nextTree = _a.sent();
                        return [2 /*return*/, nextTree.get(name.slice(1), timeout)];
                }
            });
        });
    };
    MMPT.prototype.exists = function (name, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get(name, timeout)];
                    case 1: return [2 /*return*/, (_a.sent()) !== null];
                }
            });
        });
    };
    MMPT.prototype.members = function (timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var children;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(Object.values(this.links).map(function (_a) {
                            var name = _a.name, cid = _a.cid;
                            return __awaiter(_this, void 0, void 0, function () {
                                var child, childMembers;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (name.length > 1) {
                                                return [2 /*return*/, [{ name: name, cid: cid }]];
                                            }
                                            return [4 /*yield*/, MMPT.fromCID(cid, timeout)];
                                        case 1:
                                            child = _b.sent();
                                            return [4 /*yield*/, child.members(timeout)];
                                        case 2:
                                            childMembers = _b.sent();
                                            return [2 /*return*/, childMembers.map(function (mem) { return (__assign(__assign({}, mem), { name: name + mem.name })); })];
                                    }
                                });
                            });
                        }))];
                    case 1:
                        children = _a.sent();
                        return [2 /*return*/, children.reduce(function (acc, cur) { return acc.concat(cur); })];
                }
            });
        });
    };
    MMPT.prototype.getDirectChild = function (name, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var child;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.children[name]) {
                            return [2 /*return*/, this.children[name]];
                        }
                        return [4 /*yield*/, MMPT.fromCID(this.links[name].cid, timeout)
                            // check that the child wasn't added while retrieving the mmpt from the network
                        ];
                    case 1:
                        child = _a.sent();
                        // check that the child wasn't added while retrieving the mmpt from the network
                        if (this.children[name]) {
                            return [2 /*return*/, this.children[name]];
                        }
                        this.children[name] = child;
                        return [2 /*return*/, child];
                }
            });
        });
    };
    MMPT.prototype.removeChild = function (name) {
        delete this.links[name];
        if (this.children[name]) {
            delete this.children[name];
        }
    };
    MMPT.prototype.directChildExists = function (name) {
        return this.links[name] !== undefined || this.children[name] !== undefined;
    };
    MMPT.prototype.nextTreeName = function (name) {
        if (this.directChildExists(name[0])) {
            return name[0];
        }
        else if (this.directChildExists(name)) {
            return name;
        }
        return null;
    };
    MMPT.prototype.nextTreeOrSiblingName = function (name) {
        var nibble = name[0];
        if (this.directChildExists(nibble)) {
            return nibble;
        }
        return Object.keys(this.links).find(function (child) { return nibble === child[0]; }) || null;
    };
    return MMPT;
}());
export default MMPT;
//# sourceMappingURL=mmpt.js.map