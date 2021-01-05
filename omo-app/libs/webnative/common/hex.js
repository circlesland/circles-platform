export var fromBuffer = function (buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (x) { return ('00' + x.toString(16)).slice(-2); } // '00' is for left padding
    ).join('');
};
export var toBuffer = function (hex) {
    var arr = new Uint8Array(hex.length / 2);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return arr.buffer;
};
//# sourceMappingURL=hex.js.map