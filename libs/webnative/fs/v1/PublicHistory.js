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
var PublicHistory = /** @class */ (function () {
    function PublicHistory(node) {
        this.node = node;
    }
    /**
     * Go back one or more versions.
     *
     * @param delta Optional negative number to specify how far to go back
     */
    PublicHistory.prototype.back = function (delta) {
        if (delta === void 0) { delta = -1; }
        var length = Math.abs(Math.min(delta, -1));
        return Array.from({ length: length }, function (_, i) { return i; }).reduce(function (promise) { return promise.then(function (n) { return n ? PublicHistory._getPreviousVersion(n) : null; }); }, Promise.resolve(this.node));
    };
    // async forward(delta: number = 1): Promise<Maybe<Node>> {}
    /**
     * Get a version before a given timestamp.
     *
     * @param timestamp Unix timestamp in seconds
     */
    PublicHistory.prototype.prior = function (timestamp) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, PublicHistory._prior(this.node, timestamp)];
            });
        });
    };
    /**
     * List earlier versions along with the timestamp they were created.
     */
    PublicHistory.prototype.list = function (amount) {
        if (amount === void 0) { amount = 5; }
        return __awaiter(this, void 0, void 0, function () {
            var acc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Array.from({ length: amount }, function (_, i) { return i; }).reduce(function (promise, i) { return promise.then(function (_a) {
                            var node = _a.node, acc = _a.acc;
                            if (!node)
                                return Promise.resolve({ node: null, acc: acc });
                            return PublicHistory
                                ._getPreviousVersion(node)
                                .then(function (n) { return ({
                                node: n,
                                acc: __spreadArrays(acc, [
                                    { delta: -(i + 1), timestamp: node.header.metadata.unixMeta.mtime }
                                ])
                            }); });
                        }); }, PublicHistory
                            ._getPreviousVersion(this.node)
                            .then(function (n) { return ({ node: n, acc: [] }); }))];
                    case 1:
                        acc = (_a.sent()).acc;
                        return [2 /*return*/, acc];
                }
            });
        });
    };
    /**
     * @internal
     */
    PublicHistory._getPreviousVersion = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!node.header.previous)
                    return [2 /*return*/, Promise.resolve(null)];
                return [2 /*return*/, node.constructor.fromCID(node.header.previous)];
            });
        });
    };
    /**
     * @internal
     */
    PublicHistory._prior = function (node, timestamp) {
        return __awaiter(this, void 0, void 0, function () {
            var previous;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (node.header.metadata.unixMeta.mtime < timestamp)
                            return [2 /*return*/, node];
                        return [4 /*yield*/, PublicHistory._getPreviousVersion(node)];
                    case 1:
                        previous = _a.sent();
                        return [2 /*return*/, previous ? PublicHistory._prior(previous, timestamp) : null];
                }
            });
        });
    };
    return PublicHistory;
}());
export default PublicHistory;
//# sourceMappingURL=PublicHistory.js.map