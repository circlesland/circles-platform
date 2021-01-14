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
import * as check from './fs/types/check';
import * as debug from './common/debug';
import * as did from './did';
import * as dns from './dns';
import * as ucan from './ucan';
import { api } from './common';
import { setup } from './setup/internal';
// Controller for data-root-update fetches
var fetchController = null;
/**
 * CID representing an empty string. We use to to speed up DNS propagation
 * However, we treat that as a null value in the code
 */
var EMPTY_CID = 'Qmc5m94Gu7z62RC8waSKkZUrCCBJPyHbkpmGzEePxy2oXJ';
/**
 * Get the CID of a user's data root.
 * First check Fission server, then check DNS
 *
 * @param username The username of the user that we want to get the data root of.
 */
export function lookup(username) {
    return __awaiter(this, void 0, void 0, function () {
        var maybeRoot, cid, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, lookupOnFisson(username)];
                case 1:
                    maybeRoot = _a.sent();
                    if (maybeRoot === EMPTY_CID)
                        return [2 /*return*/, null];
                    if (maybeRoot !== null)
                        return [2 /*return*/, maybeRoot];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, dns.lookupDnsLink(username + '.files.' + setup.endpoints.user)];
                case 3:
                    cid = _a.sent();
                    return [2 /*return*/, cid === EMPTY_CID ? null : cid];
                case 4:
                    err_1 = _a.sent();
                    console.error(err_1);
                    throw new Error('Could not locate user root in dns');
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get the CID of a user's data root from the Fission server.
 *
 * @param username The username of the user that we want to get the data root of.
 */
export function lookupOnFisson(username) {
    return __awaiter(this, void 0, void 0, function () {
        var logger, resp, cid, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger = debug.newLogger("lookupOnFisson()");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(setup.endpoints.api + "/user/data/" + username, { cache: 'reload' } // don't use cache
                        )];
                case 2:
                    resp = _a.sent();
                    return [4 /*yield*/, resp.json()];
                case 3:
                    cid = _a.sent();
                    if (!check.isCID(cid)) {
                        throw new Error("Did not receive a CID");
                    }
                    return [2 /*return*/, cid];
                case 4:
                    err_2 = _a.sent();
                    logger.log('Could not locate user root on Fission server: ', err_2.toString());
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Update a user's data root.
 *
 * @param cid The CID of the data root.
 * @param proof The proof to use in the UCAN sent to the API.
 */
export function update(cid, proof) {
    return __awaiter(this, void 0, void 0, function () {
        var logger, apiEndpoint;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger = debug.newLogger("DataRoot.update(cid: " + cid.toString() + ")");
                    logger.log("begin");
                    apiEndpoint = setup.endpoints.api;
                    // Debug
                    logger.log("🚀 Updating your DNSLink:", cid);
                    // Cancel previous updates
                    if (fetchController)
                        fetchController.abort();
                    fetchController = new AbortController();
                    // Make API call
                    return [4 /*yield*/, fetchWithRetry(apiEndpoint + "/user/data/" + cid, {
                            headers: function () { return __awaiter(_this, void 0, void 0, function () {
                                var jwt, _a, _b;
                                var _c;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            _b = (_a = ucan).build;
                                            _c = {};
                                            return [4 /*yield*/, api.did()];
                                        case 1:
                                            _c.audience = _d.sent();
                                            return [4 /*yield*/, did.ucan()];
                                        case 2: return [4 /*yield*/, _b.apply(_a, [(_c.issuer = _d.sent(),
                                                    _c.potency = "APPEND",
                                                    _c.proof = proof,
                                                    // TODO: Waiting on API change.
                                                    //       Should be `username.fission.name/*`
                                                    _c.resource = ucan.decode(proof).payload.rsc,
                                                    _c)])];
                                        case 3:
                                            jwt = _d.sent();
                                            return [2 /*return*/, { 'authorization': "Bearer " + jwt }];
                                    }
                                });
                            }); },
                            retries: 100,
                            retryDelay: 5000,
                            retryOn: [502, 503, 504],
                        }, {
                            method: 'PATCH',
                            signal: fetchController.signal
                        }).then(function (response) {
                            if (response.status < 300)
                                logger.log("🚀 DNSLink updated:", cid);
                            else
                                logger.log("💥  Failed to update DNSLink for:", cid);
                        }).catch(function (err) {
                            logger.log("💥  Failed to update DNSLink for:", cid);
                            console.error(err);
                        })];
                case 1:
                    // Make API call
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function fetchWithRetry(url, retryOptions, fetchOptions, retry) {
    if (retry === void 0) { retry = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var headers, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, retryOptions.headers()];
                case 1:
                    headers = _a.sent();
                    return [4 /*yield*/, fetch(url, __assign(__assign({}, fetchOptions), { headers: __assign(__assign({}, fetchOptions.headers), headers) }))];
                case 2:
                    response = _a.sent();
                    if (!retryOptions.retryOn.includes(response.status)) return [3 /*break*/, 5];
                    if (!(retry < retryOptions.retries)) return [3 /*break*/, 4];
                    return [4 /*yield*/, new Promise(function (resolve, reject) { return setTimeout(function () { return fetchWithRetry(url, retryOptions, fetchOptions, retry + 1).then(resolve, reject); }, retryOptions.retryDelay); })];
                case 3: return [2 /*return*/, _a.sent()];
                case 4: throw new Error("Too many retries for fetch");
                case 5: return [2 /*return*/, response];
            }
        });
    });
}
//# sourceMappingURL=data-root.js.map