import {Address} from "../interfaces/address";
import {config} from "../config";
import {CirclesHub} from "../circles/circlesHub";
import {BN} from "ethereumjs-util";
import {Observable, Subject} from "rxjs";
import {Event} from "../interfaces/event";

export interface CirclesTransaction
{
  id: string,
  token: Address,
  tokenOwner: Address,
  blockNo: number,
  timestamp: Date,
  direction: "in" | "out",
  subject: string,
  from: Address,
  to: Address,
  amount: BN,
}

export interface CirclesBalance
{
  lastBlockNo: number,
  tokenAddress: string,
  balance: BN
}

export interface CirclesProfile {
  loaded: boolean,
  avatarUrl?: string,
  id?: number,
  safeAddress: string,
  username?: string
}

export interface CirclesToken
{
  createdInBlockNo: number;
  tokenAddress: Address;
  tokenOwner: Address;
  balance?: BN;
}

export interface Contact
{
  circlesProfile?: CirclesProfile,
  safeAddress: Address,
  lastBlockNo: number,
  trust: {
    in?: number,
    out?: number
  }
}

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

  async tryGetMyToken() : Promise<CirclesToken>
  {
    const result = await this.hub.queryEvents(CirclesHub.queryPastSignup(this.safeAddress)).toArray();
    if (result.length == 0)
      return null;

    const signupEvent = result[0];

    return {
      tokenAddress: signupEvent.returnValues.token,
      tokenOwner: signupEvent.returnValues.user,
      createdInBlockNo: signupEvent.blockNumber.toNumber()
    }
  }

  async tryGetTokensBySafeAddress(safeAddresses:Address[]) : Promise<CirclesToken[]>
  {
    const tokensBySafeAddress = await this.hub.queryEvents(
      CirclesHub.queryPastSignups(safeAddresses)
    ).toArray();

    return tokensBySafeAddress.map(signupEvent =>
    {
      return {
        tokenAddress: signupEvent.returnValues.token,
        tokenOwner: signupEvent.returnValues.user,
        createdInBlockNo: signupEvent.blockNumber.toNumber()
      }
    });
  }

  async tryGetXDaiBalance(safeOwner?:Address) : Promise<{
    mySafeXDaiBalance: BN,
    myAccountXDaiBalance?: BN
  }>
  {
    const balances:{
      mySafeXDaiBalance: BN,
      myAccountXDaiBalance?: BN
    } = {
      mySafeXDaiBalance: new BN(await this.web3.eth.getBalance(this.safeAddress)),
    };

    if (safeOwner)
    {
      balances.myAccountXDaiBalance = new BN(await this.web3.eth.getBalance(safeOwner))
    }

    return balances;
  }

  subscribeToMyContacts() : Observable<Event>
  {
    const subject = new Subject<Event>();

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
