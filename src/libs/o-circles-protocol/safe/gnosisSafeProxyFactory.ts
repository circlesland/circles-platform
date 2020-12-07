import type Web3 from "web3";
import type { AbiItem } from "web3-utils";
import { GNOSIS_SAFE_ABI, PROXY_FACTORY_ABI, ZERO_ADDRESS } from "../consts";
import { BN } from "ethereumjs-util";
import { GnosisSafeProxy } from "./gnosisSafeProxy";
import { Web3Contract } from "../web3Contract";
import type { Address } from "../interfaces/address";
import { ByteString } from "../interfaces/byteString";

export class GnosisSafeProxyFactory extends Web3Contract {
  readonly masterSafeAddress: Address;

  constructor(web3: Web3, proxyFactoryAddress: Address, masterSafeAddress: Address) {
    super(web3, proxyFactoryAddress, new web3.eth.Contract(<AbiItem[]>PROXY_FACTORY_ABI, proxyFactoryAddress));
    this.masterSafeAddress = masterSafeAddress;
  }

  /**
   * Uses the ProxyFactory at 'proxyFactoryAddress' to deploy a new safe proxy that links to
   * the 'masterSafeAddress' implementation.
   * @param web3
   * @param masterSafeAddress
   * @param proxyFactoryAddress
   * @param creator The account that creates the instance (The creator must also be an owner!)
   * @param gasPrice The gas price in wei
   */
  async deployNewSafeProxy(privateKey: ByteString)
    : Promise<GnosisSafeProxy> {
    const ownerAddress = this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
    const gnosisSafe = new this.web3.eth.Contract(<AbiItem[]>GNOSIS_SAFE_ABI, this.masterSafeAddress);

    const proxySetupData = gnosisSafe.methods.setup(
      [ownerAddress],
      1,               // threshold (how many owners are required to sign a transaction -> 1)
      ZERO_ADDRESS,    // delegatecall for modules (none)
      "0x",            // init data for modules (none)
      ZERO_ADDRESS,    // fallbackHandler
      ZERO_ADDRESS,    // paymentToken (none defaults to ETH)
      0,               // payment
      ZERO_ADDRESS     // paymentReceiver
    ).encodeABI();

    const estimatedGas = new BN(await this.contract.methods.createProxy(
      this.masterSafeAddress,
      proxySetupData)
      .estimateGas());

    const createProxyData = await this.contract.methods.createProxy(
      this.masterSafeAddress,
      proxySetupData)
      .encodeABI();

    const signedRawTransaction = await Web3Contract.signRawTransaction(
      ownerAddress,
      privateKey,
      <any>this.address,
      createProxyData,
      estimatedGas,
      new BN("0"));

    const minedReceipt = await Web3Contract.sendSignedRawTransaction(signedRawTransaction);

    let proxyAddress = undefined;
    for (let logEntry of minedReceipt.logs) {
      if (logEntry.address != this.address) {
        continue;
      }

      const proxyCreatedEvent = this.web3.eth.abi.decodeLog([{
        name: "proxy",
        type: "address"
      }], logEntry.data, logEntry.topics);
      console.log("Deployed safe address is:", proxyCreatedEvent["proxy"]);
      proxyAddress = proxyCreatedEvent["proxy"];
      break;
    }

    if (!proxyAddress)
      throw new Error("The deployment of the safe failed. Couldn't determine the proxy address from the receipt's log.")

    return new GnosisSafeProxy(this.web3, ownerAddress, proxyAddress);
  }
}
