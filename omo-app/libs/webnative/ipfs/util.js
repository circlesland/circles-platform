import dagPB from 'ipld-dag-pb';
export var rawToDAGLink = function (raw) {
    return new dagPB.DAGLink(raw.Name, raw.Tsize, raw.Hash);
};
export var rawToDAGNode = function (raw) {
    var _a, _b, _c;
    var data = (_a = raw === null || raw === void 0 ? void 0 : raw.value) === null || _a === void 0 ? void 0 : _a.Data;
    var links = (_c = (_b = raw === null || raw === void 0 ? void 0 : raw.value) === null || _b === void 0 ? void 0 : _b.Links) === null || _c === void 0 ? void 0 : _c.map(rawToDAGLink);
    return new dagPB.DAGNode(data, links);
};
export default {
    rawToDAGLink: rawToDAGLink,
    rawToDAGNode: rawToDAGNode
};
//# sourceMappingURL=util.js.map