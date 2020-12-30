import dagPB from 'ipld-dag-pb';
export var toDAGLink = function (link) {
    var name = link.name, cid = link.cid, size = link.size;
    return new dagPB.DAGLink(name, size, cid);
};
export var fromFSFile = function (fsObj) {
    var _a = fsObj.name, name = _a === void 0 ? '' : _a, cid = fsObj.cid, size = fsObj.size, mtime = fsObj.mtime, type = fsObj.type;
    return {
        name: name,
        cid: cid.toString(),
        size: size,
        mtime: mtime,
        isFile: type !== "dir"
    };
};
export var fromDAGLink = function (link) {
    var name = link.Name;
    var cid = link.Hash.toString();
    var size = link.Tsize;
    return { name: name, cid: cid, size: size };
};
export var make = function (name, cid, isFile, size) {
    return {
        name: name,
        cid: cid,
        size: size,
        isFile: isFile,
        mtime: Date.now()
    };
};
export var arrToMap = function (arr) {
    return arr.reduce(function (acc, cur) {
        acc[cur.name] = cur;
        return acc;
    }, {});
};
//# sourceMappingURL=link.js.map