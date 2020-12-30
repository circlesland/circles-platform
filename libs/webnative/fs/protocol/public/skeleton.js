import * as pathUtil from '../../path';
export var getPath = function (skeleton, path) {
    var head = path[0];
    var child = skeleton[head] || null;
    var nextPath = pathUtil.nextNonEmpty(path);
    if (child === null || nextPath === null) {
        return child;
    }
    else {
        return getPath(child.subSkeleton, nextPath);
    }
};
//# sourceMappingURL=skeleton.js.map