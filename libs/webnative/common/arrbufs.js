export var equal = function (aBuf, bBuf) {
    var a = new Uint8Array(aBuf);
    var b = new Uint8Array(bBuf);
    if (a.length !== b.length)
        return false;
    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
};
//# sourceMappingURL=arrbufs.js.map