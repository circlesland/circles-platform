/**
 * Race an array of promises, returning whichever finishes first
 */
export function race(promises) {
    return new Promise(function (resolve, reject) {
        for (var _i = 0, promises_1 = promises; _i < promises_1.length; _i++) {
            var promise = promises_1[_i];
            promise.then(resolve, reject);
        }
    });
}
//# sourceMappingURL=async.js.map