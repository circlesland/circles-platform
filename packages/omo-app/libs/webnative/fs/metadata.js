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
import * as semver from './semver';
export var UnixNodeType;
(function (UnixNodeType) {
    UnixNodeType["Raw"] = "raw";
    UnixNodeType["Directory"] = "dir";
    UnixNodeType["File"] = "file";
    UnixNodeType["Metadata"] = "metadata";
    UnixNodeType["Symlink"] = "symlink";
    UnixNodeType["HAMTShard"] = "hamtShard";
})(UnixNodeType || (UnixNodeType = {}));
export var emptyUnix = function (isFile) { return ({
    mtime: Date.now(),
    ctime: Date.now(),
    mode: isFile ? 644 : 755,
    _type: isFile ? UnixNodeType.File : UnixNodeType.Directory,
}); };
export var empty = function (isFile) { return ({
    isFile: isFile,
    version: semver.latest,
    unixMeta: emptyUnix(isFile)
}); };
export var updateMtime = function (metadata) { return (__assign(__assign({}, metadata), { unixMeta: __assign(__assign({}, metadata.unixMeta), { mtime: Date.now() }) })); };
//# sourceMappingURL=metadata.js.map