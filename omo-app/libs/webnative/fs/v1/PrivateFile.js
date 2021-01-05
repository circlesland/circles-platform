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
import BaseFile from '../base/file';
import PrivateHistory from './PrivateHistory';
import { genKeyStr } from '../../keystore';
import { isObject } from '../../common/type-checks';
import * as check from '../protocol/private/types/check';
import * as metadata from '../metadata';
import * as protocol from '../protocol';
import * as namefilter from '../protocol/private/namefilter';
var PrivateFile = /** @class */ (function (_super) {
    __extends(PrivateFile, _super);
    function PrivateFile(_a) {
        var content = _a.content, mmpt = _a.mmpt, key = _a.key, header = _a.header;
        var _this = _super.call(this, content) || this;
        _this.header = header;
        _this.history = new PrivateHistory(_this);
        _this.key = key;
        _this.mmpt = mmpt;
        return _this;
    }
    PrivateFile.instanceOf = function (obj) {
        return isObject(obj)
            && obj.content !== undefined
            && obj.mmpt !== undefined
            && check.isPrivateFileInfo(obj.header);
    };
    PrivateFile.create = function (mmpt, content, parentNameFilter, key) {
        return __awaiter(this, void 0, void 0, function () {
            var bareNameFilter, contentKey, contentInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, namefilter.addToBare(parentNameFilter, key)];
                    case 1:
                        bareNameFilter = _a.sent();
                        return [4 /*yield*/, genKeyStr()];
                    case 2:
                        contentKey = _a.sent();
                        return [4 /*yield*/, protocol.basic.putEncryptedFile(content, contentKey)];
                    case 3:
                        contentInfo = _a.sent();
                        return [2 /*return*/, new PrivateFile({
                                content: content,
                                mmpt: mmpt,
                                key: key,
                                header: {
                                    bareNameFilter: bareNameFilter,
                                    key: contentKey,
                                    revision: 1,
                                    metadata: metadata.empty(true),
                                    content: contentInfo.cid
                                }
                            })];
                }
            });
        });
    };
    PrivateFile.fromName = function (mmpt, name, key) {
        return __awaiter(this, void 0, void 0, function () {
            var info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protocol.priv.getByName(mmpt, name, key)];
                    case 1:
                        info = _a.sent();
                        if (!check.isPrivateFileInfo(info)) {
                            throw new Error("Could not parse a valid private file using the given key");
                        }
                        return [2 /*return*/, PrivateFile.fromInfo(mmpt, key, info)];
                }
            });
        });
    };
    PrivateFile.fromInfo = function (mmpt, key, info) {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protocol.basic.getEncryptedFile(info.content, info.key)];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, new PrivateFile({
                                content: content,
                                key: key,
                                mmpt: mmpt,
                                header: info
                            })];
                }
            });
        });
    };
    PrivateFile.prototype.getName = function () {
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
    PrivateFile.prototype.updateParentNameFilter = function (parentNameFilter) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.header;
                        return [4 /*yield*/, namefilter.addToBare(parentNameFilter, this.header.key)];
                    case 1:
                        _a.bareNameFilter = _b.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    PrivateFile.prototype.updateContent = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var contentInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protocol.basic.putEncryptedFile(content, this.header.key)];
                    case 1:
                        contentInfo = _a.sent();
                        this.content = content;
                        this.header = __assign(__assign({}, this.header), { revision: this.header.revision + 1, content: contentInfo.cid });
                        return [2 /*return*/, this];
                }
            });
        });
    };
    PrivateFile.prototype.putDetailed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, protocol.priv.addNode(this.mmpt, __assign(__assign({}, this.header), { metadata: metadata.updateMtime(this.header.metadata) }), this.key)];
            });
        });
    };
    return PrivateFile;
}(BaseFile));
export { PrivateFile };
export default PrivateFile;
//# sourceMappingURL=PrivateFile.js.map