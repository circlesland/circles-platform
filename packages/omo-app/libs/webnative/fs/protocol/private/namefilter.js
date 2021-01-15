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
import { BloomFilter } from 'fission-bloom-filters';
import * as hex from '../../../common/hex';
import { sha256, sha256Str } from '../../../keystore';
// CONSTANTS
var FILTER_SIZE = 1024;
var HASH_COUNT = 16;
var SATURATION_THRESHOLD = 320;
// FUNCTIONS
// create bare name filter with a single key
export var createBare = function (key) { return __awaiter(void 0, void 0, void 0, function () {
    var empty;
    return __generator(this, function (_a) {
        empty = "0".repeat(FILTER_SIZE / 4);
        return [2 /*return*/, addToBare(empty, key)];
    });
}); };
// add some string to a name filter
export var addToBare = function (bareFilter, toAdd) { return __awaiter(void 0, void 0, void 0, function () {
    var filter, hash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                filter = fromHex(bareFilter);
                return [4 /*yield*/, sha256Str(toAdd)];
            case 1:
                hash = _a.sent();
                filter.add(hash);
                return [4 /*yield*/, toHex(filter)];
            case 2: return [2 /*return*/, (_a.sent())];
        }
    });
}); };
// add the revision number to the name filter, salted with the AES key for the node
export var addRevision = function (bareFilter, key, revision) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, addToBare(bareFilter, "" + revision + key)];
            case 1: return [2 /*return*/, (_a.sent())];
        }
    });
}); };
// saturate the filter to 320 bits and hash it with sha256 to give the private name that a node will be stored in the MMPT with
export var toPrivateName = function (revisionFilter) { return __awaiter(void 0, void 0, void 0, function () {
    var saturated;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, saturateFilter(fromHex(revisionFilter))];
            case 1:
                saturated = _a.sent();
                return [2 /*return*/, toHash(saturated)];
        }
    });
}); };
// hash a filter with sha256
export var toHash = function (filter) { return __awaiter(void 0, void 0, void 0, function () {
    var hash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, sha256(filter.toBuffer())];
            case 1:
                hash = _a.sent();
                return [2 /*return*/, (hex.fromBuffer(hash))];
        }
    });
}); };
// saturate a filter (string) to 320 bits
export var saturate = function (filter, threshold) {
    if (threshold === void 0) { threshold = SATURATION_THRESHOLD; }
    return __awaiter(void 0, void 0, void 0, function () {
        var saturated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, saturateFilter(fromHex(filter), threshold)];
                case 1:
                    saturated = _a.sent();
                    return [4 /*yield*/, toHex(saturated)];
                case 2: return [2 /*return*/, (_a.sent())];
            }
        });
    });
};
// saturate a filter to 320 bits
var saturateFilter = function (filter, threshold) {
    if (threshold === void 0) { threshold = SATURATION_THRESHOLD; }
    return __awaiter(void 0, void 0, void 0, function () {
        var bits, before, toHash, hash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (threshold > filter.toBuffer().byteLength * 8) {
                        throw new Error("threshold is bigger than filter size");
                    }
                    bits = countOnes(filter);
                    if (bits >= threshold) {
                        return [2 /*return*/, filter];
                    }
                    before = filter.toBuffer();
                    toHash = before;
                    _a.label = 1;
                case 1: return [4 /*yield*/, sha256(toHash)];
                case 2:
                    hash = _a.sent();
                    filter.add(hex.fromBuffer(hash));
                    toHash = hash;
                    _a.label = 3;
                case 3:
                    if (bufEquals(before, filter.toBuffer())) return [3 /*break*/, 1];
                    _a.label = 4;
                case 4: return [2 /*return*/, saturateFilter(filter, threshold)];
            }
        });
    });
};
// count the number of 1 bits in a filter
var countOnes = function (filter) {
    var arr = new Uint32Array(filter.toBuffer());
    var count = 0;
    for (var i = 0; i < arr.length; i++) {
        count += bitCount32(arr[i]);
    }
    return count;
};
// convert a filter to hex
export var toHex = function (filter) {
    return hex.fromBuffer(filter.toBuffer());
};
// convert hex to a BloomFilter object
export var fromHex = function (string) {
    var buf = hex.toBuffer(string);
    return BloomFilter.fromBuffer(buf, HASH_COUNT);
};
var bufEquals = function (buf1, buf2) {
    if (buf1.byteLength !== buf2.byteLength)
        return false;
    var arr1 = new Uint8Array(buf1);
    var arr2 = new Uint8Array(buf2);
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
};
// counts the number of 1s in a uint32
// from: https://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetParallel
var bitCount32 = function (num) {
    var a = num - ((num >> 1) & 0x55555555);
    var b = (a & 0x33333333) + ((a >> 2) & 0x33333333);
    return ((b + (b >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
};
//# sourceMappingURL=namefilter.js.map