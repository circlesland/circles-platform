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
import { isString } from '../../../common/type-checks';
import * as check from '../../types/check';
import { isValue } from '../../../common';
import * as ipfs from '../../../ipfs';
import * as link from '../../link';
import * as basic from '../basic';
export var putTree = function (links, skeletonVal, metadataVal, previousCID, timeout) { return __awaiter(void 0, void 0, void 0, function () {
    var userlandInfo, userland, _a, metadata, skeleton, previous, _b, _c, _d, _e, internalLinks, _f, cid, size;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, basic.putLinks(links, timeout)];
            case 1:
                userlandInfo = _g.sent();
                userland = link.make('userland', userlandInfo.cid, true, userlandInfo.size);
                return [4 /*yield*/, Promise.all([
                        putAndMakeLink('metadata', metadataVal, timeout),
                        putAndMakeLink('skeleton', skeletonVal, timeout),
                    ])];
            case 2:
                _a = _g.sent(), metadata = _a[0], skeleton = _a[1];
                if (!(previousCID != null)) return [3 /*break*/, 4];
                _d = (_c = link).make;
                _e = ['previous', previousCID, false];
                return [4 /*yield*/, ipfs.size(previousCID, timeout)];
            case 3:
                _b = _d.apply(_c, _e.concat([_g.sent()]));
                return [3 /*break*/, 5];
            case 4:
                _b = undefined;
                _g.label = 5;
            case 5:
                previous = _b;
                internalLinks = { metadata: metadata, skeleton: skeleton, userland: userland, previous: previous };
                return [4 /*yield*/, basic.putLinks(internalLinks, timeout)];
            case 6:
                _f = _g.sent(), cid = _f.cid, size = _f.size;
                return [2 /*return*/, {
                        cid: cid,
                        userland: userland.cid,
                        metadata: metadata.cid,
                        size: size,
                        isFile: false,
                        skeleton: skeletonVal
                    }];
        }
    });
}); };
export var putFile = function (content, metadataVal, previousCID, timeout) { return __awaiter(void 0, void 0, void 0, function () {
    var userlandInfo, userland, metadata, previous, _a, _b, _c, _d, internalLinks, _e, cid, size;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, basic.putFile(content, timeout)];
            case 1:
                userlandInfo = _f.sent();
                userland = link.make('userland', userlandInfo.cid, true, userlandInfo.size);
                return [4 /*yield*/, putAndMakeLink('metadata', metadataVal, timeout)];
            case 2:
                metadata = _f.sent();
                if (!(previousCID != null)) return [3 /*break*/, 4];
                _c = (_b = link).make;
                _d = ['previous', previousCID, false];
                return [4 /*yield*/, ipfs.size(previousCID, timeout)];
            case 3:
                _a = _c.apply(_b, _d.concat([_f.sent()]));
                return [3 /*break*/, 5];
            case 4:
                _a = undefined;
                _f.label = 5;
            case 5:
                previous = _a;
                internalLinks = { metadata: metadata, userland: userland, previous: previous };
                return [4 /*yield*/, basic.putLinks(internalLinks, timeout)];
            case 6:
                _e = _f.sent(), cid = _e.cid, size = _e.size;
                return [2 /*return*/, {
                        cid: cid,
                        userland: userland.cid,
                        metadata: metadata.cid,
                        size: size,
                        isFile: true,
                        skeleton: {}
                    }];
        }
    });
}); };
export var putAndMakeLink = function (name, val, timeout) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, cid, size;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, ipfs.encoded.add(val, null, timeout)];
            case 1:
                _a = _b.sent(), cid = _a.cid, size = _a.size;
                return [2 /*return*/, link.make(name, cid, true, size)];
        }
    });
}); };
export var get = function (cid, timeout) { return __awaiter(void 0, void 0, void 0, function () {
    var links, metadata, skeleton, _a, userland, previous;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, basic.getLinks(cid, timeout)];
            case 1:
                links = _d.sent();
                return [4 /*yield*/, getAndCheckValue(links, 'metadata', check.isMetadata, false, timeout)];
            case 2:
                metadata = _d.sent();
                if (!metadata.isFile) return [3 /*break*/, 3];
                _a = undefined;
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, getAndCheckValue(links, 'skeleton', check.isSkeleton, false, timeout)];
            case 4:
                _a = _d.sent();
                _d.label = 5;
            case 5:
                skeleton = _a;
                userland = ((_b = links['userland']) === null || _b === void 0 ? void 0 : _b.cid) || null;
                if (!check.isCID(userland))
                    throw new Error("Could not find userland");
                previous = ((_c = links['previous']) === null || _c === void 0 ? void 0 : _c.cid) || undefined;
                return [2 /*return*/, { userland: userland, metadata: metadata, previous: previous, skeleton: skeleton }];
        }
    });
}); };
export var getValue = function (linksOrCID, name, timeout) { return __awaiter(void 0, void 0, void 0, function () {
    var links;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isString(linksOrCID)) return [3 /*break*/, 2];
                return [4 /*yield*/, basic.getLinks(linksOrCID, timeout)];
            case 1:
                links = _a.sent();
                return [2 /*return*/, getValueFromLinks(links, name, timeout)];
            case 2: return [2 /*return*/, getValueFromLinks(linksOrCID, name, timeout)];
        }
    });
}); };
export var getValueFromLinks = function (links, name, timeout) { return __awaiter(void 0, void 0, void 0, function () {
    var linkCID;
    var _a;
    return __generator(this, function (_b) {
        linkCID = (_a = links[name]) === null || _a === void 0 ? void 0 : _a.cid;
        if (!linkCID)
            return [2 /*return*/, null];
        return [2 /*return*/, ipfs.encoded.catAndDecode(linkCID, null, timeout)];
    });
}); };
export var getAndCheckValue = function (linksOrCid, name, checkFn, canBeNull, timeout) {
    if (canBeNull === void 0) { canBeNull = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var val;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getValue(linksOrCid, name, timeout)];
                case 1:
                    val = _a.sent();
                    return [2 /*return*/, checkValue(val, name, checkFn, canBeNull)];
            }
        });
    });
};
export var checkValue = function (val, name, checkFn, canBeNull) {
    if (canBeNull === void 0) { canBeNull = false; }
    if (!isValue(val)) {
        if (canBeNull)
            return val;
        throw new Error("Could not find header value: " + name);
    }
    if (checkFn(val)) {
        return val;
    }
    throw new Error("Improperly formatted header value: " + name);
};
//# sourceMappingURL=index.js.map