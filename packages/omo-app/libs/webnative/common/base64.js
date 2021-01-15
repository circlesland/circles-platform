export function urlDecode(a) {
    return atob(makeUrlUnsafe(a));
}
export function urlEncode(b) {
    return makeUrlSafe(btoa(b));
}
export function makeUrlSafe(a) {
    return a.replace(/\//g, "_").replace(/\+/g, "-").replace(/=+$/, "");
}
export function makeUrlUnsafe(a) {
    return a.replace(/_/g, "/").replace(/-/g, "+");
}
//# sourceMappingURL=base64.js.map