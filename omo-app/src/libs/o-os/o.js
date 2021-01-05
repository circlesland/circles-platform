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
import * as webnative from "webnative";
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
webnative.setup.debug({ enabled: true });
export const o = {
    stateMachines: stateMachine,
    wn: webnative
};
