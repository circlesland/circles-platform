import type {AbiItem} from "web3-utils";
import type Web3 from "web3";
import {EMPTY_DATA, GNOSIS_SAFE_ABI, ZERO_ADDRESS} from "../consts";
import {BN} from "ethereumjs-util";
import {config} from "../config";
import EthLibAccount from "eth-lib/lib/account";
import {Web3Contract} from "../web3Contract";
import type {Address} from "../interfaces/address";
import type {Account} from "../interfaces/account";
import type {GnosisSafeTransaction} from "../interfaces/gnosisSafeTransaction";
import {GnosisSafeOps} from "../interfaces/gnosisSafeOps";
import type {ByteString} from "../interfaces/byteString";

export class GnosisSafeProxy extends Web3Contract
{
  readonly creatorAddress: Address;

  constructor(web3: Web3, creatorAddress: Address, safeProxyAddress: Address)
  {
    super(web3, safeProxyAddress, new web3.eth.Contract(<AbiItem[]>GNOSIS_SAFE_ABI, safeProxyAddress));
    this.creatorAddress = creatorAddress;
  }

  static queryPastSuccessfulExecutions(address: Address)
  {
    return {
      event: "ExecutionSuccess",
      address: address,
      fromBlock: "earliest",
      toBlock: "latest"
    };
  }

  static readonly AddedOwnerEvent = "AddedOwner";
  static readonly ApproveHashEvent = "ApproveHash";
  static readonly ChangedMasterCopyEvent = "ChangedMasterCopy";
  static readonly ChangedThresholdEvent = "ChangedThreshold";
  static readonly DisabledModuleEvent = "DisabledModule";
  static readonly EnabledModuleEvent = "EnabledModule";
  static readonly ExecutionFailureEvent = "ExecutionFailure";
  static readonly ExecutionFromModuleFailureEvent = "ExecutionFromModuleFailure";
  static readonly ExecutionFromModuleSuccessEvent = "ExecutionFromModuleSuccess";
  static readonly ExecutionSuccessEvent = "ExecutionSuccess";
  static readonly RemovedOwnerEvent = "RemovedOwner";
  static readonly SignMsgEvent = "SignMsg";

  async getOwners(): Promise<string[]>
  {
    return await this.contract.methods.getOwners().call();
  }

  async getNonce(): Promise<number>
  {
    return parseInt(await this.contract.methods.nonce().call());
  }

  async sendEth(account: Account, value: BN, to: Address)
  {
    const safeTransaction = <GnosisSafeTransaction>{
      value: value,
      to: to,
      operation: GnosisSafeOps.CALL,
      data: "0x",
      gasToken: ZERO_ADDRESS,
      refundReceiver: ZERO_ADDRESS,
      gasPrice: config.getCurrent().getGasPrice(this.web3)
    };
    return await this.execTransaction(account, safeTransaction);
  }

  async execTransaction(account: Account, safeTransaction: GnosisSafeTransaction)
  {
    this.validateSafeTransaction(safeTransaction);

    const estimatedBaseGas = this.estimateBaseGasCosts(safeTransaction, 1)
      .add(new BN(this.web3.utils.toWei("10000", "wei")));

    const estimatedSafeTxGas = (await this.estimateSafeTxGasCosts(safeTransaction))
      .add(new BN(this.web3.utils.toWei("10000", "wei")));

    const nonce = await this.getNonce();

    const executableTransaction = <GnosisSafeTransaction>{
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

    const transactionHash = await this.getTransactionHash(executableTransaction);
    const signatures = GnosisSafeProxy.signTransactionHash(this.web3, account.privateKey, transactionHash);

    const gasEstimationResult = await this.contract.methods.execTransaction(
      executableTransaction.to,
      executableTransaction.value,
      executableTransaction.data,
      executableTransaction.operation,
      executableTransaction.safeTxGas,
      executableTransaction.baseGas,
      config.getCurrent().getGasPrice(this.web3),
      executableTransaction.gasToken,
      executableTransaction.refundReceiver,
      signatures.signature).estimateGas();

    const gasEstimate = new BN(gasEstimationResult).add(estimatedBaseGas).add(estimatedSafeTxGas);

    const execTransactionData = this.toAbiMessage(executableTransaction, signatures.signature);
    const signedTransactionData = await this.signRawTransaction(
      account,
      this.address,
      execTransactionData,
      gasEstimate,
      new BN("0"));

    return await this.sendSignedRawTransaction(signedTransactionData);
  }

  private validateSafeTransaction(safeTransaction: GnosisSafeTransaction)
  {
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
  private async getTransactionHash(safeTransaction: GnosisSafeTransaction)
  {
    this.validateSafeTransaction(safeTransaction);

    return await this.contract.methods.getTransactionHash(
      safeTransaction.to,
      safeTransaction.value,
      safeTransaction.data,
      safeTransaction.operation,
      safeTransaction.safeTxGas,
      safeTransaction.baseGas,
      config.getCurrent().getGasPrice(this.web3),
      safeTransaction.gasToken,
      safeTransaction.refundReceiver,
      safeTransaction.nonce
    ).call();
  }

  private async estimateSafeTxGasCosts(safeTransaction: GnosisSafeTransaction): Promise<BN>
  {
    // from https://github.com/gnosis/safe-react -> /src/logic/safe/transactions/gasNew.ts
    this.validateSafeTransaction(safeTransaction);

    const estimateDataCallData = this.contract.methods.requiredTxGas(
      safeTransaction.to,
      safeTransaction.value,
      safeTransaction.data,
      safeTransaction.operation).encodeABI();

    let txGasEstimation = new BN("0");

    await this.web3.eth.call({
      from: this.address,
      to: this.address,
      data: estimateDataCallData
    })
      .catch(e =>
      {
        if (!e.data)
          throw new Error(JSON.stringify(e));

        let estimateInError = e.data;
        if (estimateInError.startsWith("Reverted 0x"))
        {
          estimateInError = estimateInError.substr(11);
        }
        txGasEstimation = new BN(estimateInError.substring(138), 16)
      });

    if (txGasEstimation.eq(new BN("0")))
      throw new Error("The safe's txGas cost estimation function should always fail with a 'revert' error.");

    const dataGasEstimation = this.estimateDataGasCosts(safeTransaction.data)
      .add(new BN("21000"));

    return txGasEstimation.add(dataGasEstimation);
  }

  private estimateBaseGasCosts(safeTransaction: GnosisSafeTransaction, signatureCount: number): BN
  {
    const abiMessage = this.toAbiMessage(safeTransaction);
    const dataGasCosts = this.estimateDataGasCosts(abiMessage);
    const signatureCosts = signatureCount == 0
      ? new BN(0)
      : GnosisSafeProxy.estimateSignatureCosts(signatureCount);

    return dataGasCosts.add(signatureCosts);
  }

  private static estimateSignatureCosts(signatureCount: number): BN
  {
    // (array count (3 -> r, s, v) + ecrecover costs) * signature count;
    return new BN(signatureCount * (68 + 2176 + 2176 + 6000));
  }

  private toAbiMessage(safeTransaction: GnosisSafeTransaction, signatures?: string)
  {
    this.validateSafeTransaction(safeTransaction);

    return this.contract.methods.execTransaction(
      safeTransaction.to,
      safeTransaction.value,
      safeTransaction.data,
      safeTransaction.operation,
      safeTransaction.safeTxGas ?? new BN("0"),
      safeTransaction.baseGas ?? new BN("0"),
      config.getCurrent().getGasPrice(this.web3),
      safeTransaction.gasToken,
      safeTransaction.refundReceiver,
      signatures ?? "0x")
      .encodeABI();
  }

  private estimateDataGasCosts(data: ByteString): BN
  {
    const reducer = (accumulator: any, currentValue: string) =>
    {
      if (currentValue === EMPTY_DATA)
      {
        return accumulator + 0
      }

      if (currentValue === '00')
      {
        return accumulator + 4
      }

      return accumulator + 16
    }

    return new BN(data.match(/.{2}/g)?.reduce(reducer, 0));
  }

  private static signTransactionHash(
    web3: Web3,
    safeOwnerPrivateKey: string,
    transactionHash: string
  )
  {
    const signature = EthLibAccount.sign(transactionHash, safeOwnerPrivateKey);
    const vrs = EthLibAccount.decodeSignature(signature);

    return {
      signature,
      r: web3.utils.toBN(vrs[1]).toString("hex"),
      s: web3.utils.toBN(vrs[2]).toString("hex"),
      v: web3.utils.toDecimal(vrs[0]), // Leave the 'v' value at 27 or 28 to get into the EOA verification in GnosisSafe.sol:255
    };
  }
}
