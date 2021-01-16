export var isDefined = function (val) {
    return val !== undefined;
};
export var notNull = function (val) {
    return val !== null;
};
export var isJust = notNull;
export var isValue = function (val) {
    return isDefined(val) && notNull(val);
};
export var isBool = function (val) {
    return typeof val === 'boolean';
};
export var isNum = function (val) {
    return typeof val === 'number';
};
export var isString = function (val) {
    return typeof val === 'string';
};
export var isObject = function (val) {
    return val !== null && typeof val === 'object';
};
export var isBlob = function (val) {
    var _a;
    if (typeof Blob === 'undefined')
        return false;
    return val instanceof Blob || (isObject(val) && ((_a = val === null || val === void 0 ? void 0 : val.constructor) === null || _a === void 0 ? void 0 : _a.name) === 'Blob');
};
//# sourceMappingURL=type-checks.js.map