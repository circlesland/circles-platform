import { isNum, isObject, isString } from '../../../../common';
import * as check from '../../../types/check';
export var isDecryptedNode = function (obj) {
    return isPrivateTreeInfo(obj) || isPrivateFileInfo(obj);
};
export var isPrivateFileInfo = function (obj) {
    return isObject(obj)
        && check.isMetadata(obj.metadata)
        && obj.metadata.isFile
        && isString(obj.key)
        && check.isCID(obj.content);
};
export var isPrivateTreeInfo = function (obj) {
    return isObject(obj)
        && check.isMetadata(obj.metadata)
        && obj.metadata.isFile === false
        && isNum(obj.revision)
        && isPrivateLinks(obj.links)
        && isPrivateSkeleton(obj.skeleton);
};
export var isPrivateLink = function (obj) {
    return check.isBaseLink(obj)
        && isString(obj.key)
        && isString(obj.pointer);
};
export var isPrivateLinks = function (obj) {
    return isObject(obj)
        && Object.values(obj).every(isPrivateLink);
};
export var isPrivateSkeleton = function (obj) {
    return isObject(obj)
        && Object.values(obj).every(isPrivateSkeletonInfo);
};
export var isPrivateSkeletonInfo = function (obj) {
    return isObject(obj)
        && check.isCID(obj.cid)
        && isString(obj.key)
        && isPrivateSkeleton(obj.subSkeleton);
};
//# sourceMappingURL=check.js.map