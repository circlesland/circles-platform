var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { config } from "../config";
import { CirclesHub } from "../circles/circlesHub";
import { BN } from "ethereumjs-util";
import { Subject } from "rxjs";
import { CirclesToken } from "./circlesToken";
import { ZERO_ADDRESS } from "../consts";
import { GnosisSafeOps } from "../interfaces/gnosisSafeOps";
import { Erc20Token } from "../token/erc20Token";
export class CirclesAccount {
    constructor(safeAddress) {
        this.cfg = config.getCurrent();
        this.web3 = config.getCurrent().web3();
        this.safeAddress = safeAddress;
        this.hub = new CirclesHub(this.web3, this.cfg.HUB_ADDRESS);
    }
    getUBI(privateKey, safe) {
        return __awaiter(this, void 0, void 0, function* () {
            const ownToken = yield this.tryGetMyToken();
            const erc20Contract = new Erc20Token(this.web3, ownToken.tokenAddress);
            const txData = erc20Contract.contract.methods.update().encodeABI();
            return yield safe.execTransaction(privateKey, {
                to: ownToken.tokenAddress,
                data: txData,
                value: new BN("0"),
                refundReceiver: ZERO_ADDRESS,
                gasToken: ZERO_ADDRESS,
                operation: GnosisSafeOps.CALL
            });
        });
    }
    tryGetMyToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.hub.queryEvents(CirclesHub.queryPastSignup(this.safeAddress)).toArray();
            if (result.length == 0) {
                return null;
            }
            const signupEvent = result[0];
            const token = new CirclesToken(this.safeAddress);
            token.tokenAddress = signupEvent.returnValues.token;
            token.tokenOwner = signupEvent.returnValues.user;
            token.createdInBlockNo = signupEvent.blockNumber.toNumber();
            token.noTransactionsUntilBlockNo = signupEvent.blockNumber.toNumber();
            return token;
        });
    }
    tryGetTokensBySafeAddress(safeAddresses) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokensBySafeAddress = yield this.hub.queryEvents(CirclesHub.queryPastSignups(safeAddresses)).toArray();
            return tokensBySafeAddress.map(signupEvent => {
                const token = new CirclesToken(this.safeAddress);
                token.tokenAddress = signupEvent.returnValues.token;
                token.tokenOwner = signupEvent.returnValues.user;
                token.createdInBlockNo = signupEvent.blockNumber.toNumber();
                token.noTransactionsUntilBlockNo = signupEvent.blockNumber.toNumber();
                return token;
            });
        });
    }
    tryGetXDaiBalance(safeOwner) {
        return __awaiter(this, void 0, void 0, function* () {
            const balances = {};
            if (this.safeAddress) {
                balances.mySafeXDaiBalance = new BN(yield this.web3.eth.getBalance(this.safeAddress));
            }
            if (safeOwner) {
                balances.myAccountXDaiBalance = new BN(yield this.web3.eth.getBalance(safeOwner));
            }
            return balances;
        });
    }
    subscribeToMyContacts() {
        const subject = new Subject();
        const myIncomingTrusts = this.hub.queryEvents(CirclesHub.queryPastTrusts(null, this.safeAddress));
        myIncomingTrusts.events.subscribe(trustEvent => {
            subject.next(trustEvent);
        });
        myIncomingTrusts.execute();
        const myOutgoingTrusts = this.hub.queryEvents(CirclesHub.queryPastTrusts(this.safeAddress, null));
        myOutgoingTrusts.events.subscribe(trustEvent => {
            subject.next(trustEvent);
        });
        myOutgoingTrusts.execute();
        return subject;
    }
}
