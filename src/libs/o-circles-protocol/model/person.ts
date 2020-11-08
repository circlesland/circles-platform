import type {Safe} from "../interfaces/safe";
import type {Address} from "../interfaces/address";
import {CirclesHub} from "../circles/circlesHub";
import {BN} from "ethereumjs-util";
import {CirclesToken} from "./circlesToken";
import {Erc20Token} from "../token/erc20Token";
import type {Event} from "../interfaces/event";
import type {Account} from "../interfaces/account";
import type {GnosisSafeProxy} from "../safe/gnosisSafeProxy";

export type TokenAndOwner = {
  token: CirclesToken,
  owner: Person,
  limit?: number
}

export type AddressLookup = Map<Address, TokenAndOwner>

export type TokenTransfer = {
  subject: string,
  amount: string,
  blockNo: BN,
  timestamp: string,
  from: Address,
  to: Address
}

export class Person implements Safe
{
  /**
   * The address of the safe that represents this participant.
   */
  readonly address: Address;
  readonly circlesHub: CirclesHub;

  private _tokenAddress?: Address;

  private _receivableTokens?: AddressLookup;
  private _trustedAddresses?: AddressLookup;

  private _trusterTokens?: AddressLookup;
  private _trusterAddresses?: AddressLookup;

  constructor(circlesHub: CirclesHub, safeAddress: Address, tokenAddress?: Address)
  {
    this.address = safeAddress;
    this.circlesHub = circlesHub;
    this._tokenAddress = tokenAddress;
  }

  async getTokenBalances(reload?: boolean): Promise<{ balance: BN, token: Address }[]>
  {
    const myToken = await this.getOwnToken();
    if (!myToken)
      throw new Error("The person has no token");

    const receivableTokens = await this.getReceivableTokens(reload);

    const tokenBalances = await Promise.all(
      Object
        .keys(receivableTokens)
        .map(async tokenAddress =>
        {
          return {
            token: tokenAddress,
            balance: await receivableTokens[tokenAddress].token.getBalanceOf(this.address)
          };
        }));

    return tokenBalances;
  }

  async getUBI(account:Account, safe:GnosisSafeProxy): Promise<any>
  {
    const owntoken = await this.getOwnToken();
    console.log(owntoken);
    return await owntoken.getUBI(account, safe);
  }

  async getBalance(reload?: boolean): Promise<BN>
  {
    const tokenBalances = await this.getTokenBalances(reload);

    return tokenBalances.reduce(
      (p, c) => p.add(c.balance),
      new BN("0"));
  }

  async getIncomingTransactions(reload?: boolean): Promise<TokenTransfer[]>
  {
    const receivableTokens = await this.getReceivableTokens(reload);
    const incomingTransactions: Event[][] = await Promise.all(
      Object
        .keys(receivableTokens)
        .map(async address => await receivableTokens[address]
          .token
          .queryEvents(Erc20Token.queryPastTransfers(undefined, this.address))
          .toArray()));

    return incomingTransactions.reduce((p, c) => p.concat(c)).map(o =>
    {
      let amount = this.circlesHub.web3.utils.fromWei(o.returnValues.value, "ether");
      const dot = amount.indexOf(".");
      amount = amount.slice(0, dot + 3);
      return {
        direction: "in",
        blockNo: o.blockNumber,
        timestamp: o.blockNumber.toString(),
        amount: amount,
        from: o.returnValues.from,
        subject: "Circles transfer",
        to: o.returnValues.to,
        o
      };
    });
  }

  async getOutgoingTransactions(reload?: boolean): Promise<TokenTransfer[]>
  {
    const possibleReceivers = await this.getTrustingPersons(reload);
    const myToken = await this.getOwnToken();
    const outgoingTransactions: Event[][] = await Promise.all(
      Object
        .keys(possibleReceivers)
        .map(async address =>
          myToken
            .queryEvents(Erc20Token.queryPastTransfers(this.address, address))
            .toArray()
        ));

    return outgoingTransactions.reduce((p, c) => p.concat(c)).map(o =>
    {
      let amount = this.circlesHub.web3.utils.fromWei(o.returnValues.value, "ether");
      const dot = amount.indexOf(".");
      amount = amount.slice(0, dot + 3);
      return {
        direction: "out",
        blockNo: o.blockNumber,
        timestamp: o.blockNumber.toString(),
        amount: amount,
        from: o.returnValues.from,
        subject: "Circles transfer",
        to: o.returnValues.to,
        o
      };
    });
  }

  async getTrustingTokens(reload?: boolean): Promise<AddressLookup>
  {
    if (this._trusterTokens && !reload)
    {
      return this._trusterTokens;
    }

    await this.getTrustingPersons(reload);

    return this._trusterTokens;
  }

  async getTrustingPersons(reload?: boolean): Promise<AddressLookup>
  {
    if (this._trusterAddresses && !reload)
    {
      return this._trusterAddresses;
    }

    const _trusterTokens = new Map<Address, TokenAndOwner>();
    const _trusterAddresses = new Map<Address, TokenAndOwner>();

    const canSendTo = await this.circlesHub
      .queryEvents(CirclesHub.queryPastTrusts(undefined, this.address))
      .getLatest(e => e.returnValues.canSendTo);

    (await this.circlesHub
      .queryEvents(CirclesHub.queryPastSignups(Object.keys(canSendTo)))
      .toArray())
      .map(event =>
      {
        return {
          token: event.returnValues.token,
          ofUser: event.returnValues.user,
          limit: canSendTo[event.returnValues.user].returnValues.limit
        };
      })
      .map(o =>
      {
        return {
          token: new CirclesToken(this.circlesHub.web3, o.token),
          owner: new Person(this.circlesHub, o.ofUser, o.token),
          limit: o.limit
        };
      })
      .forEach(o =>
      {
        _trusterTokens[o.token.address] = o;
        _trusterAddresses[o.owner.address] = o;
      });

    this._trusterTokens = _trusterTokens;
    this._trustedAddresses = _trusterAddresses;

    return _trusterAddresses;
  }

  async getTrustedPersons(reload?: boolean): Promise<AddressLookup>
  {
    if (this._trustedAddresses && !reload)
    {
      return this._trustedAddresses;
    }

    await this.getReceivableTokens(reload);

    return this._trustedAddresses;
  }

  async getReceivableTokens(reload?: boolean): Promise<AddressLookup>
  {
    if (this._receivableTokens && !reload)
    {
      return this._receivableTokens;
    }

    const canReceiveFrom = await this.circlesHub
      .queryEvents(CirclesHub.queryPastTrusts(this.address, undefined))
      .getLatest(e => e.returnValues.user);

    const _receivableTokens = new Map<Address, TokenAndOwner>();
    const _trustedAddresses = new Map<Address, TokenAndOwner>();

    (await this.circlesHub
      .queryEvents(CirclesHub.queryPastSignups(Object.keys(canReceiveFrom)))
      .toArray())
      .map(event =>
      {
        return {
          token: event.returnValues.token,
          ofUser: event.returnValues.user,
          limit: canReceiveFrom[event.returnValues.user].returnValues.limit
        };
      })
      .map(o =>
      {
        return {
          token: new CirclesToken(this.circlesHub.web3, o.token),
          owner: new Person(this.circlesHub, o.ofUser, o.token),
          limit: o.limit
        };
      })
      .forEach(o =>
      {
        _receivableTokens[o.token.address] = o;
        _trustedAddresses[o.owner.address] = o;
      });

    this._receivableTokens = _receivableTokens;
    this._trustedAddresses = _trustedAddresses;

    return _receivableTokens;
  }

  /**
   * Gets the personal circles token of this person.
   */
  async getOwnToken(): Promise<CirclesToken | undefined>
  {
    if (this._tokenAddress)
    {
      return new CirclesToken(this.circlesHub.web3, this._tokenAddress);
    }

    const events = await this.circlesHub.queryEvents(CirclesHub.queryPastSignup(this.address)).toArray();

    if (events.length == 0)
      return undefined;

    this._tokenAddress = events[0].returnValues.token;

    if (!this._tokenAddress)
      return undefined;

    return new CirclesToken(this.circlesHub.web3, this._tokenAddress);
  }
}
