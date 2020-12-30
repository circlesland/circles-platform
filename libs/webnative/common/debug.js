import { setup } from '../setup/internal';
export function log() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (setup.debug)
        console.log.apply(console, args);
}
//# sourceMappingURL=debug.js.map