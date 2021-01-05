var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ERC20_ABI, ZERO_ADDRESS } from "../consts";
import { BN } from "ethereumjs-util";
import { Web3Contract } from "../web3Contract";
import { GnosisSafeOps } from "../interfaces/gnosisSafeOps";
import { config } from "../config";
export class Erc20Token extends Web3Contract {
    constructor(web3, tokenAddress) {
        super(web3, tokenAddress, new web3.eth.Contract(ERC20_ABI, tokenAddress));
    }
    static queryPastTransfers(from, to, fromBlock, toBlock) {
        if (!from && !to)
            throw new Error("At least one of the two parameters has to be set to a value.");
        let f = {};
        if (from)
            f.from = from;
        if (to)
            f.to = to;
        return {
            event: "Transfer",
            filter: f,
            fromBlock: fromBlock !== null && fromBlock !== void 0 ? fromBlock : config.getCurrent().HUB_BLOCK,
            toBlock: toBlock !== null && toBlock !== void 0 ? toBlock : "latest"
        };
    }
    transfer(privateKey, safeProxy, to, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const txData = this.contract.methods.transfer(to, amount).encodeABI();
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
    getBalanceOf(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this.contract.methods.balanceOf(address).call();
            return new BN(balance);
        });
    }
}
Erc20Token.TransferEvent = "Transfer";
Erc20Token.ApprovalEvent = "Approval";
