var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { stateMachine } from "./stateMachine";
import { CirclesHub } from "../o-circles-protocol/circles/circlesHub";
import { GnosisSafeProxyFactory } from "../o-circles-protocol/safe/gnosisSafeProxyFactory";
import { config } from "../o-circles-protocol/config";
import * as webnative from "libs/webnative";
import { runWithDrive } from "../o-fission/initFission";
/**
 * Gets all environment properties like the currently logged-on account, token and profile.
 */
export function getEnvironment() {
    return __awaiter(this, void 0, void 0, function* () {
        const cfg = config.getCurrent();
        const web3 = cfg.web3();
        const eth = {
            web3: web3,
            contracts: {
                hub: new CirclesHub(web3, cfg.HUB_ADDRESS),
                safeProxyFactory: new GnosisSafeProxyFactory(web3, cfg.PROXY_FACTORY_ADDRESS, cfg.GNOSIS_SAFE_ADDRESS)
            }
        };
        const environment = {
            eth: eth
        };
        return environment;
    });
}
export function getProcessContext() {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            environment: yield getEnvironment(),
            data: {}
        };
    });
}
let sessionLog = {
    name: Date.now().toString(),
    messages: []
};
export function newLogger(name, parent) {
    return {
        name,
        parent,
        log: (...args) => {
            if (args === null || args === void 0 ? void 0 : args.length) {
                const remainingArgs = args.splice(1);
                if (remainingArgs.length) {
                    console.log(`${Date.now()} [${name}]: ${args[0]}`, remainingArgs);
                    sessionLog.messages.push({
                        message: `${Date.now()} [${name}]: ${args[0]}`,
                        args: remainingArgs
                    });
                }
                else {
                    console.log(`${Date.now()} [${name}]: ${args[0]}`);
                    sessionLog.messages.push({
                        message: `${Date.now()} [${name}]: ${args[0]}`,
                        args: undefined
                    });
                }
            }
        },
        newLogger: (name) => newLogger(name, parent)
    };
}
window.addEventListener('error', function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger.log("An error occurred:", {
                error: event.error,
                file: event.filename,
                line: event.lineno,
                message: event.message
            });
            yield runWithDrive((drive) => __awaiter(this, void 0, void 0, function* () {
                yield drive.sessionLogs.addOrUpdate(sessionLog, true);
            }));
        }
        catch (e) {
            console.error(`Couldn't write the error log to the fission drive:`, e);
        }
    });
});
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield runWithDrive((drive) => __awaiter(void 0, void 0, void 0, function* () {
            yield drive.sessionLogs.addOrUpdate(sessionLog, false);
            if (sessionLog.messages.length > 10000) {
                sessionLog = {
                    name: sessionLog.name + "_" + Date.now(),
                    messages: []
                };
            }
        }));
    }
    catch (e) {
        console.error(`Couldn't perform the periodic log-flush to the fission drive:`, e);
    }
}), 30000);
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield runWithDrive((drive) => __awaiter(void 0, void 0, void 0, function* () {
            yield drive.sessionLogs.addOrUpdate(sessionLog, true);
            if (sessionLog.messages.length > 10000) {
                sessionLog = {
                    name: sessionLog.name + "_" + Date.now(),
                    messages: []
                };
            }
        }));
    }
    catch (e) {
        console.error(`Couldn't perform the periodic log-publishing to the fission drive:`, e);
    }
}), 240000);
const logger = newLogger("o");
webnative.setup.debug({
    enabled: true,
    logger: logger.log
});
export const o = {
    stateMachines: stateMachine,
    wn: webnative,
    logger: logger
};
