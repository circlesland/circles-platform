// FUNCTIONS
export var encode = function (major, minor, patch) {
    return {
        major: major,
        minor: minor,
        patch: patch
    };
};
export var fromString = function (str) {
    var parts = str.split('.').map(function (x) { return parseInt(x); }); // dont shorten this because parseInt has a second param
    if (parts.length !== 3 || parts.some(function (p) { return typeof p !== 'number'; })) {
        return null;
    }
    return {
        major: parts[0],
        minor: parts[1],
        patch: parts[2]
    };
};
export var toString = function (version) {
    var major = version.major, minor = version.minor, patch = version.patch;
    return major + "." + minor + "." + patch;
};
// VERSIONS
export var v0 = encode(0, 0, 0);
export var v1 = encode(1, 0, 0);
export var latest = encode(1, 0, 0);
//# sourceMappingURL=semver.js.map