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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import CIDObj from 'cids';
import dagPB from 'ipld-dag-pb';
import { get as getIpfs } from './config';
import util from './util';
import { DAG_NODE_DATA } from './constants';
export var add = function (content) { return __awaiter(void 0, void 0, void 0, function () {
    var ipfs, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getIpfs()];
            case 1:
                ipfs = _a.sent();
                return [4 /*yield*/, ipfs.add(content, { cidVersion: 1 })];
            case 2:
                result = _a.sent();
                return [2 /*return*/, {
                        cid: result.cid.toString(),
                        size: result.size,
                        isFile: true
                    }];
        }
    });
}); };
export var catRaw = function (cid) { return __awaiter(void 0, void 0, void 0, function () {
    var ipfs, chunks, _a, _b, chunk, e_1_1;
    var e_1, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, getIpfs()];
            case 1:
                ipfs = _d.sent();
                chunks = [];
                return [4 /*yield*/, attemptPin(cid)];
            case 2:
                _d.sent();
                _d.label = 3;
            case 3:
                _d.trys.push([3, 8, 9, 14]);
                _a = __asyncValues(ipfs.cat(cid));
                _d.label = 4;
            case 4: return [4 /*yield*/, _a.next()];
            case 5:
                if (!(_b = _d.sent(), !_b.done)) return [3 /*break*/, 7];
                chunk = _b.value;
                if (Buffer.isBuffer(chunk))
                    chunks.push(chunk);
                else
                    chunks.push(Buffer.from(chunk));
                _d.label = 6;
            case 6: return [3 /*break*/, 4];
            case 7: return [3 /*break*/, 14];
            case 8:
                e_1_1 = _d.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 14];
            case 9:
                _d.trys.push([9, , 12, 13]);
                if (!(_b && !_b.done && (_c = _a.return))) return [3 /*break*/, 11];
                return [4 /*yield*/, _c.call(_a)];
            case 10:
                _d.sent();
                _d.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 13: return [7 /*endfinally*/];
            case 14: return [2 /*return*/, chunks];
        }
    });
}); };
export var catBuf = function (cid) { return __awaiter(void 0, void 0, void 0, function () {
    var raw;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, catRaw(cid)];
            case 1:
                raw = _a.sent();
                return [2 /*return*/, Buffer.concat(raw)];
        }
    });
}); };
export var cat = function (cid) { return __awaiter(void 0, void 0, void 0, function () {
    var buf;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, catBuf(cid)];
            case 1:
                buf = _a.sent();
                return [2 /*return*/, buf.toString()];
        }
    });
}); };
export var ls = function (cid) { return __awaiter(void 0, void 0, void 0, function () {
    var ipfs, links, _a, _b, link, e_2_1;
    var e_2, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, getIpfs()];
            case 1:
                ipfs = _d.sent();
                links = [];
                _d.label = 2;
            case 2:
                _d.trys.push([2, 7, 8, 13]);
                _a = __asyncValues(ipfs.ls(cid));
                _d.label = 3;
            case 3: return [4 /*yield*/, _a.next()];
            case 4:
                if (!(_b = _d.sent(), !_b.done)) return [3 /*break*/, 6];
                link = _b.value;
                links.push(link);
                _d.label = 5;
            case 5: return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 13];
            case 7:
                e_2_1 = _d.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 13];
            case 8:
                _d.trys.push([8, , 11, 12]);
                if (!(_b && !_b.done && (_c = _a.return))) return [3 /*break*/, 10];
                return [4 /*yield*/, _c.call(_a)];
            case 9:
                _d.sent();
                _d.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
            case 12: return [7 /*endfinally*/];
            case 13: return [2 /*return*/, links];
        }
    });
}); };
export var dagGet = function (cid) { return __awaiter(void 0, void 0, void 0, function () {
    var ipfs, raw, node;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getIpfs()];
            case 1:
                ipfs = _a.sent();
                return [4 /*yield*/, attemptPin(cid)];
            case 2:
                _a.sent();
                return [4 /*yield*/, ipfs.dag.get(new CIDObj(cid))];
            case 3:
                raw = _a.sent();
                node = util.rawToDAGNode(raw);
                return [2 /*return*/, node];
        }
    });
}); };
export var dagPut = function (node) { return __awaiter(void 0, void 0, void 0, function () {
    var ipfs, cidObj, cid, nodeSize;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getIpfs()
                // using this format because Gateway doesn't like `dag-cbor` nodes.
                // I think this is because UnixFS requires `dag-pb` & the gateway requires UnixFS for directory traversal
            ];
            case 1:
                ipfs = _a.sent();
                return [4 /*yield*/, ipfs.dag.put(node, { format: 'dag-pb', hashAlg: 'sha2-256' })];
            case 2:
                cidObj = _a.sent();
                cid = cidObj.toV1().toString();
                return [4 /*yield*/, size(cid)];
            case 3:
                nodeSize = _a.sent();
                return [2 /*return*/, {
                        cid: cid,
                        size: nodeSize,
                        isFile: false
                    }];
        }
    });
}); };
export var dagPutLinks = function (links) { return __awaiter(void 0, void 0, void 0, function () {
    var node;
    return __generator(this, function (_a) {
        node = new dagPB.DAGNode(DAG_NODE_DATA, links);
        return [2 /*return*/, dagPut(node)];
    });
}); };
export var size = function (cid) { return __awaiter(void 0, void 0, void 0, function () {
    var ipfs, stat;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getIpfs()];
            case 1:
                ipfs = _a.sent();
                return [4 /*yield*/, ipfs.files.stat("/ipfs/" + cid)];
            case 2:
                stat = _a.sent();
                return [2 /*return*/, stat.cumulativeSize];
        }
    });
}); };
export var reconnect = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getIpfs()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
export var attemptPin = function (cid) { return __awaiter(void 0, void 0, void 0, function () {
    var ipfs, _err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getIpfs()];
            case 1:
                ipfs = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, ipfs.pin.add(cid, { recursive: false })];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                _err_1 = _a.sent();
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=basic.js.map