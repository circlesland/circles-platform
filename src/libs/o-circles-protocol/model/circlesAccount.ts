import {Address} from "../interfaces/address";
import {config} from "../config";
import {CirclesHub} from "../circles/circlesHub";
import {BN} from "ethereumjs-util";
import {Observable, Subject} from "rxjs";
import {BlockchainEvent} from "../interfaces/blockchainEvent";
import {CirclesToken} from "./circlesToken";
import {ByteString} from "../interfaces/byteString";
import {GnosisSafeProxy} from "../safe/gnosisSafeProxy";
import {ZERO_ADDRESS} from "../consts";
import {GnosisSafeOps} from "../interfaces/gnosisSafeOps";
import {Erc20Token} from "../token/erc20Token";

export class CirclesAccount
{
  readonly safeAddress: Address;

  private readonly cfg = config.getCurrent();
  private readonly web3 = config.getCurrent().web3();
  private readonly hub;

  constructor(safeAddress: Address)
  {
    this.safeAddress = safeAddress;
    this.hub = new CirclesHub(this.web3, this.cfg.HUB_ADDRESS);
  }

  async getUBI(privateKey: ByteString, safe: GnosisSafeProxy): Promise<any>
  {
    const ownToken = await this.tryGetMyToken();
    const erc20Contract = new Erc20Token(this.web3, ownToken.tokenAddress);
    const txData = erc20Contract.contract.methods.update().encodeABI();

    return await safe.execTransaction(
      privateKey,
      {
        to: ownToken.tokenAddress,
        data: txData,
        value: new BN("0"),
        refundReceiver: ZERO_ADDRESS,
        gasToken: ZERO_ADDRESS,
        operation: GnosisSafeOps.CALL
      });
  }

  async tryGetMyToken(): Promise<CirclesToken>
  {
    const result = await this.hub.queryEvents(CirclesHub.queryPastSignup(this.safeAddress)).toArray();
    if (result.length == 0)
    {
      return null;
    }

    const signupEvent = result[0];

    const token = new CirclesToken(this.safeAddress);
    token.tokenAddress = signupEvent.returnValues.token;
    token.tokenOwner = signupEvent.returnValues.user;
    token.createdInBlockNo = signupEvent.blockNumber.toNumber()

    return token;
  }

  async tryGetTokensBySafeAddress(safeAddresses: Address[]): Promise<CirclesToken[]>
  {
    const tokensBySafeAddress = await this.hub.queryEvents(
      CirclesHub.queryPastSignups(safeAddresses)
    ).toArray();

    return tokensBySafeAddress.map(signupEvent =>
    {
      const token = new CirclesToken(this.safeAddress);
      token.tokenAddress = signupEvent.returnValues.token;
      token.tokenOwner = signupEvent.returnValues.user;
      token.createdInBlockNo = signupEvent.blockNumber.toNumber();

      return token;
    });
  }

  async tryGetXDaiBalance(safeOwner?: Address): Promise<{
    mySafeXDaiBalance?: BN,
    myAccountXDaiBalance?: BN
  }>
  {
    const balances: {
      mySafeXDaiBalance?: BN,
      myAccountXDaiBalance?: BN
    } = {};

    if (this.safeAddress)
    {
      balances.mySafeXDaiBalance = new BN(await this.web3.eth.getBalance())
    }

    if (safeOwner)
    {
      balances.myAccountXDaiBalance = new BN(await this.web3.eth.getBalance(safeOwner))
    }

    return balances;
  }

  subscribeToMyContacts(): Observable<BlockchainEvent>
  {
    const subject = new Subject<BlockchainEvent>();

    const myIncomingTrusts = this.hub.queryEvents(CirclesHub.queryPastTrusts(null, this.safeAddress));
    myIncomingTrusts.events.subscribe(trustEvent =>
    {
      subject.next(trustEvent);
    });

    myIncomingTrusts.execute();

    const myOutgoingTrusts = this.hub.queryEvents(CirclesHub.queryPastTrusts(this.safeAddress, null));
    myOutgoingTrusts.events.subscribe(trustEvent =>
    {
      subject.next(trustEvent);
    });

    myOutgoingTrusts.execute();

    return subject;
  }
}
