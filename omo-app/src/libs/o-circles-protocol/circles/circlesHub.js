var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CIRCLES_HUB_ABI, ZERO_ADDRESS } from "../consts";
import { BN } from "ethereumjs-util";
import { Web3Contract } from "../web3Contract";
import { GnosisSafeOps } from "../interfaces/gnosisSafeOps";
import { config } from "../config";
export class CirclesHub extends Web3Contract {
    constructor(web3, hubAddress) {
        super(web3, hubAddress, new web3.eth.Contract(CIRCLES_HUB_ABI, hubAddress));
    }
    static queryPastSignup(user, fromBlock) {
        return {
            event: CirclesHub.SignupEvent,
            filter: {
                user: user
            },
            fromBlock: fromBlock !== null && fromBlock !== void 0 ? fromBlock : config.getCurrent().HUB_BLOCK,
            toBlock: "latest"
        };
    }
    static queryPastSignups(ofUsers, fromBlock) {
        return {
            event: CirclesHub.SignupEvent,
            filter: {
                user: ofUsers
            },
            fromBlock: fromBlock !== null && fromBlock !== void 0 ? fromBlock : config.getCurrent().HUB_BLOCK,
            toBlock: "latest"
        };
    }
    static queryPastTransfers(from, to, fromBlock) {
        if (!from && !to)
            throw new Error("At least one of the two parameters has to be set to a value.");
        let f = {};
        if (from)
            f.from = from;
        if (to)
            f.to = to;
        return {
            event: CirclesHub.HubTransferEvent,
            filter: f,
            fromBlock: fromBlock !== null && fromBlock !== void 0 ? fromBlock : config.getCurrent().HUB_BLOCK,
            toBlock: "latest"
        };
    }
    static queryPastTrusts(canSendTo, user, fromBlock, toBlock) {
        if (!canSendTo && !user)
            throw new Error("At least one of the two parameters has to be set to a value.");
        let f = {};
        if (canSendTo)
            f.canSendTo = canSendTo;
        if (user)
            f.user = user;
        return {
            event: CirclesHub.TrustEvent,
            filter: f,
            fromBlock: fromBlock !== null && fromBlock !== void 0 ? fromBlock : config.getCurrent().HUB_BLOCK,
            toBlock: toBlock !== null && toBlock !== void 0 ? toBlock : "latest"
        };
    }
    signup(privateKey, safeProxy) {
        return __awaiter(this, void 0, void 0, function* () {
            const txData = this.contract.methods.signup().encodeABI();
            return yield safeProxy.execTransaction(privateKey, {
                to: this.address,
                data: txData,
                value: new BN("0"),
                refundReceiver: ZERO_ADDRESS,
                gasToken: ZERO_ADDRESS,
                operation: GnosisSafeOps.CALL
            });
        });
    }
    setTrust(privateKey, safeProxy, to, trustPercentage) {
        return __awaiter(this, void 0, void 0, function* () {
            const txData = this.contract.methods.trust(to, trustPercentage).encodeABI();
            return yield safeProxy.execTransaction(privateKey, {
                to: this.address,
                data: txData,
                value: new BN("0"),
                refundReceiver: ZERO_ADDRESS,
                gasToken: ZERO_ADDRESS,
                operation: GnosisSafeOps.CALL
            });
        });
    }
    transferTrough(privateKey, safeProxy, tokenOwners, sources, destinations, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const transfer = {
                tokenOwners: tokenOwners,
                sources: sources,
                destinations: destinations,
                values: values,
            };
            // TODO: Check the send limit for each edge with the hub contract
            /*
            const sendLimit = await this.contract.methods
              .checkSendLimit(safeProxy.address, safeProxy.address, to)
              .call();
        
            if (new BN(sendLimit).lt(amount))
              throw new Error("You cannot transfer " + amount.toString() + "units to " + to + " because the recipient doesn't trust your tokens.");
            */
            const txData = yield this.contract.methods.transferThrough(transfer.tokenOwners, transfer.sources, transfer.destinations, transfer.values)
                .encodeABI();
            window.o.logger.log("transferTroughAbi:", txData);
            return yield safeProxy.execTransaction(privateKey, {
                to: this.address,
                data: txData,
                value: new BN("0"),
                refundReceiver: ZERO_ADDRESS,
                gasToken: ZERO_ADDRESS,
                operation: GnosisSafeOps.CALL
            });
        });
    }
}
CirclesHub.SignupEvent = "Signup";
CirclesHub.HubTransferEvent = "HubTransfer";
CirclesHub.OrganizationSignupEvent = "OrganizationSignup";
CirclesHub.TrustEvent = "Trust";
