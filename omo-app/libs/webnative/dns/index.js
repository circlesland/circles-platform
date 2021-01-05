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
import { race } from '../common/async';
/**
 * Lookup a DNS TXT record.
 *
 * Race lookups to Google & Cloudflare, return the first to finish
 *
 * @param domain The domain to get the TXT record from.
 * @returns Contents of the TXT record.
 */
export function lookupTxtRecord(domain) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, race([
                    googleLookup(domain),
                    cloudflareLookup(domain)
                ])];
        });
    });
}
/**
 * Lookup DNS TXT record using Google DNS-over-HTTPS
 *
 * @param domain The domain to get the TXT record from.
 * @returns Contents of the TXT record.
 */
export function googleLookup(domain) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dnsOverHttps("https://dns.google/resolve?name=" + domain + "&type=txt")];
        });
    });
}
/**
 * Lookup DNS TXT record using Cloudflare DNS-over-HTTPS
 *
 * @param domain The domain to get the TXT record from.
 * @returns Contents of the TXT record.
 */
export function cloudflareLookup(domain) {
    return dnsOverHttps("https://cloudflare-dns.com/dns-query?name=" + domain + "&type=txt");
}
/**
 * Lookup a DNS TXT record.
 *
 * If there are multiple records, they will be joined together.
 * Records are sorted by a decimal prefix before they are joined together.
 * Prefixes have a format of `001;` → `999;`
 *
 * @param url The DNS-over-HTTPS endpoint to hit.
 * @returns Contents of the TXT record.
 */
export function dnsOverHttps(url) {
    return fetch(url, {
        headers: {
            "accept": "application/dns-json"
        }
    })
        .then(function (r) { return r.json(); })
        .then(function (r) {
        if (r.Answer) {
            // Remove double-quotes from beginning and end of the resulting string (if present)
            var answers = r.Answer.map(function (a) {
                return (a.data || "").replace(/^"+|"+$/g, "");
            });
            // Sort by prefix, if prefix is present,
            // and then add the answers together as one string.
            if (answers[0][3] === ";") {
                return answers
                    .sort(function (a, b) { return a.slice(0, 4).localeCompare(b.slice(0, 4)); })
                    .map(function (a) { return a.slice(4); })
                    .join("");
            }
            else {
                return answers.join("");
            }
        }
        else {
            return null;
        }
    });
}
/**
 * Lookup a DNSLink.
 *
 * @param domain The domain to get the DNSLink from.
 * @returns Contents of the DNSLink with the "ipfs/" prefix removed.
 */
export function lookupDnsLink(domain) {
    return __awaiter(this, void 0, void 0, function () {
        var txt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, lookupTxtRecord(domain.startsWith("_dnslink.")
                        ? domain
                        : "_dnslink." + domain)];
                case 1:
                    txt = _a.sent();
                    return [2 /*return*/, txt && !txt.includes("/ipns/")
                            ? txt.replace(/^dnslink=/, "").replace(/^\/ipfs\//, "")
                            : null];
            }
        });
    });
}
//# sourceMappingURL=index.js.map