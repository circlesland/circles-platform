var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EMPTY_DATA, GNOSIS_SAFE_ABI, ZERO_ADDRESS } from "../consts";
import { BN } from "ethereumjs-util";
import { config } from "../config";
import EthLibAccount from "eth-lib/lib/account";
import { Web3Contract } from "../web3Contract";
import { GnosisSafeOps } from "../interfaces/gnosisSafeOps";
export class GnosisSafeProxy extends Web3Contract {
    constructor(web3, creatorAddress, safeProxyAddress) {
        super(web3, safeProxyAddress, new web3.eth.Contract(GNOSIS_SAFE_ABI, safeProxyAddress));
        this.creatorAddress = creatorAddress;
    }
    static queryPastSuccessfulExecutions(address) {
        return {
            event: "ExecutionSuccess",
            address: address,
            fromBlock: "earliest",
            toBlock: "latest"
        };
    }
    getOwners() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.contract.methods.getOwners().call();
        });
    }
    getNonce() {
        return __awaiter(this, void 0, void 0, function* () {
            return parseInt(yield this.contract.methods.nonce().call());
        });
    }
    transferEth(privateKey, value, to) {
        return __awaiter(this, void 0, void 0, function* () {
            const safeTransaction = {
                value: value,
                to: to,
                operation: GnosisSafeOps.CALL,
                data: "0x",
                gasToken: ZERO_ADDRESS,
                refundReceiver: ZERO_ADDRESS,
                gasPrice: config.getCurrent().getGasPrice(this.web3)
            };
            return yield this.execTransaction(privateKey, safeTransaction);
        });
    }
    execTransaction(privateKey, safeTransaction, dontEstimate) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateSafeTransaction(safeTransaction);
            const estimatedBaseGas = dontEstimate
                ? new BN(this.web3.utils.toWei("1000000", "wei"))
                : this.estimateBaseGasCosts(safeTransaction, 1)
                    .add(new BN(this.web3.utils.toWei("10000", "wei")));
            const estimatedSafeTxGas = dontEstimate
                ? new BN(this.web3.utils.toWei("1000000", "wei"))
                : (yield this.estimateSafeTxGasCosts(safeTransaction))
                    .add(new BN(this.web3.utils.toWei("10000", "wei")));
            const nonce = yield this.getNonce();
            const executableTransaction = {
                to: safeTransaction.to,
                value: safeTransaction.value,
                data: safeTransaction.data,
                operation: safeTransaction.operation,
                safeTxGas: estimatedSafeTxGas,
                baseGas: estimatedBaseGas,
                gasToken: safeTransaction.gasToken,
                refundReceiver: safeTransaction.refundReceiver,
                nonce: nonce
            };
            const transactionHash = yield this.getTransactionHash(executableTransaction);
            const signatures = GnosisSafeProxy.signTransactionHash(this.web3, privateKey, transactionHash);
            const gasEstimationResult = yield this.contract.methods.execTransaction(executableTransaction.to, executableTransaction.value, executableTransaction.data, executableTransaction.operation, executableTransaction.safeTxGas, executableTransaction.baseGas, config.getCurrent().getGasPrice(this.web3), executableTransaction.gasToken, executableTransaction.refundReceiver, signatures.signature).estimateGas();
            const gasEstimate = new BN(gasEstimationResult).add(estimatedBaseGas).add(estimatedSafeTxGas);
            const execTransactionData = this.toAbiMessage(executableTransaction, signatures.signature);
            const signedTransactionData = yield Web3Contract.signRawTransaction((yield this.getOwners())[0], privateKey, this.address, execTransactionData, gasEstimate, new BN("0"));
            return yield Web3Contract.sendSignedRawTransaction(signedTransactionData);
        });
    }
    validateSafeTransaction(safeTransaction) {
        if (safeTransaction.safeTxGas && !BN.isBN(safeTransaction.safeTxGas))
            throw new Error("The 'safeTxGas' property of the transaction is not a valid bn.js BigNum.");
        if (safeTransaction.baseGas && !BN.isBN(safeTransaction.baseGas))
            throw new Error("The 'baseGas' property of the transaction is not a valid bn.js BigNum.");
        if (!BN.isBN(safeTransaction.value))
            throw new Error("The 'value' property of the transaction is not a valid bn.js BigNum.");
        if (!safeTransaction.data.startsWith("0x"))
            throw new Error("The 'data' property doesn't have a '0x' prefix and therefore is not a valid byteString.");
        if (!this.web3.utils.isAddress(safeTransaction.gasToken))
            throw new Error("The 'gasToken' property doesn't contain a valid Ethereum address.");
        if (!this.web3.utils.isAddress(safeTransaction.to))
            throw new Error("The 'to' property doesn't contain a valid Ethereum address.");
        if (!this.web3.utils.isAddress(safeTransaction.refundReceiver))
            throw new Error("The 'refundReceiver' property doesn't contain a valid Ethereum address.");
        if (safeTransaction.nonce && !Number.isInteger(safeTransaction.nonce))
            throw new Error("The 'nonce' property doesn't contain a javascript integer value.");
    }
    /**
     * Asks the safe to create a message hash for the supplied safeTransaction that can be signed
     * by the owners of the safe to authorize it.
     * @param safeTransaction
     */
    getTransactionHash(safeTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateSafeTransaction(safeTransaction);
            return yield this.contract.methods.getTransactionHash(safeTransaction.to, safeTransaction.value, safeTransaction.data, safeTransaction.operation, safeTransaction.safeTxGas, safeTransaction.baseGas, config.getCurrent().getGasPrice(this.web3), safeTransaction.gasToken, safeTransaction.refundReceiver, safeTransaction.nonce).call();
        });
    }
    estimateSafeTxGasCosts(safeTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            // from https://github.com/gnosis/safe-react -> /src/logic/safe/transactions/gasNew.ts
            this.validateSafeTransaction(safeTransaction);
            const estimateDataCallData = this.contract.methods.requiredTxGas(safeTransaction.to, safeTransaction.value, safeTransaction.data, safeTransaction.operation).encodeABI();
            let txGasEstimation = new BN("0");
            yield this.web3.eth.call({
                from: this.address,
                to: this.address,
                data: estimateDataCallData
            })
                .catch(e => {
                if (!e.data)
                    throw new Error(JSON.stringify(e));
                let estimateInError = e.data;
                if (estimateInError.startsWith("Reverted 0x")) {
                    estimateInError = estimateInError.substr(11);
                }
                txGasEstimation = new BN(estimateInError.substring(138), 16);
            });
            if (txGasEstimation.eq(new BN("0")))
                throw new Error("The safe's txGas cost estimation function should always fail with a 'revert' error that contains the cost from character 11 on.");
            const dataGasEstimation = this.estimateDataGasCosts(safeTransaction.data)
                .add(new BN("21000"));
            return txGasEstimation.add(dataGasEstimation);
        });
    }
    estimateBaseGasCosts(safeTransaction, signatureCount) {
        const abiMessage = this.toAbiMessage(safeTransaction);
        const dataGasCosts = this.estimateDataGasCosts(abiMessage);
        const signatureCosts = signatureCount == 0
            ? new BN(0)
            : GnosisSafeProxy.estimateSignatureCosts(signatureCount);
        return dataGasCosts.add(signatureCosts);
    }
    static estimateSignatureCosts(signatureCount) {
        // (array count (3 -> r, s, v) + ecrecover costs) * signature count;
        return new BN(signatureCount * (68 + 2176 + 2176 + 6000));
    }
    toAbiMessage(safeTransaction, signatures) {
        var _a, _b;
        this.validateSafeTransaction(safeTransaction);
        return this.contract.methods.execTransaction(safeTransaction.to, safeTransaction.value, safeTransaction.data, safeTransaction.operation, (_a = safeTransaction.safeTxGas) !== null && _a !== void 0 ? _a : new BN("0"), (_b = safeTransaction.baseGas) !== null && _b !== void 0 ? _b : new BN("0"), config.getCurrent().getGasPrice(this.web3), safeTransaction.gasToken, safeTransaction.refundReceiver, signatures !== null && signatures !== void 0 ? signatures : "0x")
            .encodeABI();
    }
    estimateDataGasCosts(data) {
        var _a;
        const reducer = (accumulator, currentValue) => {
            if (currentValue === EMPTY_DATA) {
                return accumulator + 0;
            }
            if (currentValue === '00') {
                return accumulator + 4;
            }
            return accumulator + 16;
        };
        return new BN((_a = data.match(/.{2}/g)) === null || _a === void 0 ? void 0 : _a.reduce(reducer, 0));
    }
    static signTransactionHash(web3, safeOwnerPrivateKey, transactionHash) {
        const signature = EthLibAccount.sign(transactionHash, safeOwnerPrivateKey);
        const vrs = EthLibAccount.decodeSignature(signature);
        return {
            signature,
            r: web3.utils.toBN(vrs[1]).toString("hex"),
            s: web3.utils.toBN(vrs[2]).toString("hex"),
            v: web3.utils.toDecimal(vrs[0]),
        };
    }
}
GnosisSafeProxy.AddedOwnerEvent = "AddedOwner";
GnosisSafeProxy.ApproveHashEvent = "ApproveHash";
GnosisSafeProxy.ChangedMasterCopyEvent = "ChangedMasterCopy";
GnosisSafeProxy.ChangedThresholdEvent = "ChangedThreshold";
GnosisSafeProxy.DisabledModuleEvent = "DisabledModule";
GnosisSafeProxy.EnabledModuleEvent = "EnabledModule";
GnosisSafeProxy.ExecutionFailureEvent = "ExecutionFailure";
GnosisSafeProxy.ExecutionFromModuleFailureEvent = "ExecutionFromModuleFailure";
GnosisSafeProxy.ExecutionFromModuleSuccessEvent = "ExecutionFromModuleSuccess";
GnosisSafeProxy.ExecutionSuccessEvent = "ExecutionSuccess";
GnosisSafeProxy.RemovedOwnerEvent = "RemovedOwner";
GnosisSafeProxy.SignMsgEvent = "SignMsg";
