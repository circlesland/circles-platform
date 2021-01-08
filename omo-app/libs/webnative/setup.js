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
import { setup as internalSetup } from './setup/internal';
/**
 * Toggle debug mode.
 *
 * Only adds a few `console.log`s at this moment.
 */
export function debug(_a) {
    var enabled = _a.enabled, logger = _a.logger;
    internalSetup.debug = enabled;
    internalSetup.logger = logger;
    return internalSetup.debug;
}
/**
 * Override endpoints.
 *
 * You can override each of these,
 * no need to provide them all here.
 *
 * `api` Location of the Fission API
 *       (default `https://runfission.com`)
 * `lobby` Location of the authentication lobby.
 *         (default `https://auth.fission.codes`)
 * `user`  User's domain to use, will be prefixed by username.
 *         (default `fission.name`)
 */
export function endpoints(e) {
    internalSetup.endpoints = __assign(__assign({}, internalSetup.endpoints), e);
    return __assign({}, internalSetup.endpoints);
}
//# sourceMappingURL=setup.js.map