import { setup } from '../setup/internal';
export function newLogger(name, parent) {
    return {
        name: name,
        parent: parent,
        log: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (setup.debug && (args === null || args === void 0 ? void 0 : args.length)) {
                var remainingArgs = args.splice(1);
                if (remainingArgs.length) {
                    if (setup.logger) {
                        setup.logger(Date.now() + " [" + name + "]: " + args[0], remainingArgs);
                    }
                    else {
                        console.log(Date.now() + " [" + name + "]: " + args[0], remainingArgs);
                    }
                }
                else {
                    if (setup.logger) {
                        setup.logger(Date.now() + " [" + name + "]: " + args[0]);
                    }
                    else {
                        console.log(Date.now() + " [" + name + "]: " + args[0]);
                    }
                }
            }
        },
        newLogger: function (name) { return newLogger(name, parent); }
    };
}
//# sourceMappingURL=debug.js.map