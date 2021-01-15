/** @internal */
/** @internal */
import { isString, isObject, isNum, isBool } from '../../common';
export var isFile = function (obj) {
    return isObject(obj) && obj.content !== undefined;
};
export var isTree = function (obj) {
    return isObject(obj) && obj.ls !== undefined;
};
export var isBaseLink = function (obj) {
    return isObject(obj)
        && isString(obj.name)
        && isNum(obj.size)
        && isBool(obj.isFile);
};
export var isLink = function (obj) {
    return isBaseLink(obj)
        && isCID(obj.cid);
};
export var isLinks = function (obj) {
    return isObject(obj)
        && Object.values(obj).every(isLink);
};
export var isUnixMeta = function (obj) {
    return isObject(obj)
        && isNum(obj.mtime)
        && isNum(obj.ctime)
        && isNum(obj.mode)
        && isString(obj._type);
};
export var isMetadata = function (obj) {
    return isObject(obj)
        && isUnixMeta(obj.unixMeta)
        && isBool(obj.isFile)
        && isSemVer(obj.version);
};
export var isSkeleton = function (obj) {
    return isObject(obj)
        && Object.values(obj).every(function (val) { return (isObject(val)
            && isCID(val.cid)
            && isCID(val.userland)
            && isCID(val.metadata)
            && isSkeleton(val.subSkeleton)); });
};
export var isTreeHeader = function (obj) {
    return isObject(obj)
        && isSkeleton(obj.skeleton)
        && isMetadata(obj.metadata)
        && obj.metadata.isFile === false;
};
export var isTreeInfo = function (obj) {
    return isTreeHeader(obj)
        && isCID(obj.userland);
};
export var isFileHeader = function (obj) {
    return isObject(obj)
        && isMetadata(obj.metadata)
        && obj.metadata.isFile === true;
};
export var isFileInfo = function (obj) {
    return isFileHeader(obj)
        && isCID(obj.userland);
};
export var isCID = function (obj) {
    return isString(obj);
};
export var isCIDList = function (obj) {
    return Array.isArray(obj)
        && obj.every(isCID);
};
export var isSemVer = function (obj) {
    if (!isObject(obj))
        return false;
    var major = obj.major, minor = obj.minor, patch = obj.patch;
    return isNum(major) && isNum(minor) && isNum(patch);
};
//# sourceMappingURL=check.js.map