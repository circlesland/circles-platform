export var splitParts = function (path) {
    return path.split('/').filter(function (p) { return p.length > 0; });
};
export var join = function (parts) {
    return parts.join('/');
};
export var joinNoSuffix = function (parts) {
    var joined = join(parts);
    return joined[joined.length - 1] === '/'
        ? joined.slice(0, joined.length - 1)
        : joined;
};
export var takeHead = function (path) {
    var parts = splitParts(path);
    var next = parts.slice(1);
    return {
        head: parts[0] || null,
        nextPath: next.length > 0 ? join(next) : null
    };
};
export var takeTail = function (path) {
    var parts = splitParts(path);
    var parent = parts.slice(0, parts.length - 1);
    return {
        tail: parts[parts.length - 1] || null,
        parentPath: parent.length > 0 ? join(parent) : null
    };
};
export var splitNonEmpty = function (path) {
    var parts = splitParts(path);
    if (parts.length < 1) {
        return null;
    }
    return parts;
};
export var nextNonEmpty = function (parts) {
    var next = parts.slice(1);
    if (next.length < 1) {
        return null;
    }
    return next;
};
export var sameParent = function (a, b) {
    return splitParts(a)[0] === splitParts(b)[0];
};
//# sourceMappingURL=path.js.map