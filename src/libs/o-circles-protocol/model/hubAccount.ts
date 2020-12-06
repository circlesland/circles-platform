import type { Safe } from "../interfaces/safe";
import type { Address } from "../interfaces/address";
import { CirclesHub } from "../circles/circlesHub";
import { BN } from "ethereumjs-util";
import { CirclesToken } from "./circlesToken";
import { Erc20Token } from "../token/erc20Token";
import type { Event } from "../interfaces/event";
import type { Account } from "../interfaces/account";
import type { GnosisSafeProxy } from "../safe/gnosisSafeProxy";
import { ByteString } from "../interfaces/byteString";

export type TokenAndOwner = {
    token: CirclesToken,
    owner: HubAccount,
    limit?: number
}

export type AddressLookup = Map<Address, TokenAndOwner>

export type TokenTransfer = {
    subject: string,
    amount: string,
    blockNo: BN,
    timestamp?: Date,
    from: Address,
    to: Address
}

export class HubAccount implements Safe {
    /**
     * The address of the safe that represents this participant.
     */
    readonly address: Address;
    readonly circlesHub: CirclesHub;

    private _tokenAddress?: Address;

    private _tokensITrust?: AddressLookup;
    private _personsITrust?: AddressLookup;

    private _tokensThatTrustMe?: AddressLookup;
    private _personsThatTrustMe?: AddressLookup;

    constructor(circlesHub: CirclesHub, safeAddress: Address, tokenAddress?: Address) {
        this.address = safeAddress;
        this.circlesHub = circlesHub;
        this._tokenAddress = tokenAddress;
    }

    async getEthBalance(reload?: boolean): Promise<BN> {
        return new BN(await this.circlesHub.web3.eth.getBalance(this.address));
    }

    async getTokenBalances(reload?: boolean): Promise<{ balance: BN, token: Address }[]> {
        const myToken = await this.getOwnToken();
        if (!myToken) {
            console.warn("The person has no token");
            return [];
        }
        const receivableTokens = await this.getTokensITrust(reload);

        const tokenBalances = await Promise.all(
            Object
                .keys(receivableTokens)
                .map(async tokenAddress => {
                    const token = receivableTokens[tokenAddress];
                    const balanceBN = await token.token.getBalanceOf(this.address);
                    let balanceString = this.circlesHub.web3.utils.fromWei(balanceBN).toString();
                    const dot = balanceString.indexOf(".");
                    balanceString = balanceString.slice(0, dot + 3);
                    return {
                        token: tokenAddress,
                        owner: token.owner,
                        balance: balanceBN,
                        balanceString: balanceString,
                        limit: token.limit
                    };
                }));

        return tokenBalances;
    }

    async getUBI(privateKey: ByteString, safe: GnosisSafeProxy): Promise<any> {
        const owntoken = await this.getOwnToken();
        return await owntoken.getUBI(privateKey, safe);
    }

    async getTokenBalance(reload?: boolean): Promise<BN> {
        const tokenBalances = await this.getTokenBalances(reload);

        return tokenBalances.reduce(
            (p, c) => p.add(c.balance),
            new BN("0"));
    }

    async getIncomingTransactions(reload?: boolean): Promise<TokenTransfer[]> {
        //
        // Circles transactions
        //
        const receivableTokens = await this.getTokensITrust(reload);
        const incomingTransactions: Event[][] = await Promise.all(
            Object
                .keys(receivableTokens)
                .map(async address => await receivableTokens[address]
                    .token
                    .queryEvents(Erc20Token.queryPastTransfers(undefined, this.address))
                    .toArray()));

        if (!incomingTransactions || incomingTransactions.length == 0)
            return [];

        return incomingTransactions.reduce((p, c) => p.concat(c)).map(o => {
            let amount = this.circlesHub.web3.utils.fromWei(o.returnValues.value, "ether");
            return {
                direction: "in",
                blockNo: o.blockNumber,
                timestamp: null,
                amount: amount,
                from: o.returnValues.from,
                subject: "⦿ transfer",
                to: o.returnValues.to,
                o
            };
        });
    }

    async getOutgoingTransactions(reload?: boolean): Promise<TokenTransfer[]> {
        const possibleReceivers = await this.getPersonsThatTrustMe(reload);
        const myToken = await this.getOwnToken();
        const outgoingTransactions: Event[][] = await Promise.all(
            Object
                .keys(possibleReceivers)
                .map(async address =>
                    myToken
                        .queryEvents(Erc20Token.queryPastTransfers(this.address, address))
                        .toArray()
                ));

        if (!outgoingTransactions || outgoingTransactions.length == 0)
            return [];

        return outgoingTransactions.reduce((p, c) => p.concat(c)).map(o => {
            let amount = this.circlesHub.web3.utils.fromWei(o.returnValues.value, "ether");
            return {
                direction: "out",
                blockNo: o.blockNumber,
                timestamp: null,
                amount: amount,
                from: o.returnValues.from,
                subject: "⦿ transfer",
                to: o.returnValues.to,
                o
            };
        });
    }

    async getTokensThatTrustMe(reload?: boolean): Promise<AddressLookup> {
        if (this._tokensThatTrustMe && !reload) {
            return this._tokensThatTrustMe;
        }

        await this.getPersonsThatTrustMe(reload);

        return this._tokensThatTrustMe;
    }

    async getPersonsThatTrustMe(reload?: boolean): Promise<AddressLookup> {
        if (this._personsThatTrustMe && !reload) {
            return this._personsThatTrustMe;
        }

        const _tokensThatTrustMe = new Map<Address, TokenAndOwner>();
        const _personsThatTrustMe = new Map<Address, TokenAndOwner>();

        const canSendTo = await this.circlesHub
            .queryEvents(CirclesHub.queryPastTrusts(undefined, this.address))
            .getLatest(e => e.returnValues.canSendTo);

        (await this.circlesHub
            .queryEvents(CirclesHub.queryPastSignups(Object.keys(canSendTo)))
            .toArray())
            .map(event => {
                return {
                    token: event.returnValues.token,
                    ofUser: event.returnValues.user,
                    limit: canSendTo[event.returnValues.user].returnValues.limit
                };
            })
            .map(o => {
                return {
                    token: new CirclesToken(this.circlesHub.web3, o.token),
                    owner: new HubAccount(this.circlesHub, o.ofUser, o.token),
                    limit: o.limit
                };
            })
            .forEach(o => {
                _tokensThatTrustMe[o.token.address] = o;
                _personsThatTrustMe[o.owner.address] = o;
            });

        this._tokensThatTrustMe = _tokensThatTrustMe;
        this._personsThatTrustMe = _personsThatTrustMe;

        return _personsThatTrustMe;
    }

    async getPersonsITrust(reload?: boolean): Promise<AddressLookup> {
        if (this._personsITrust && !reload) {
            return this._personsITrust;
        }

        await this.getTokensITrust(reload);

        return this._personsITrust;
    }

    async getTokensITrust(reload?: boolean): Promise<AddressLookup> {
        if (this._tokensITrust && !reload) {
            return this._tokensITrust;
        }

        const canReceiveFrom = await this.circlesHub
            .queryEvents(CirclesHub.queryPastTrusts(this.address, undefined))
            .getLatest(e => e.returnValues.user);

        const _receivableTokens = new Map<Address, TokenAndOwner>();
        const _trustedAddresses = new Map<Address, TokenAndOwner>();

        (await this.circlesHub
            .queryEvents(CirclesHub.queryPastSignups(Object.keys(canReceiveFrom)))
            .toArray())
            .map(event => {
                return {
                    token: event.returnValues.token,
                    ofUser: event.returnValues.user,
                    limit: canReceiveFrom[event.returnValues.user].returnValues.limit
                };
            })
            .map(o => {
                return {
                    token: new CirclesToken(this.circlesHub.web3, o.token),
                    owner: new HubAccount(this.circlesHub, o.ofUser, o.token),
                    limit: o.limit
                };
            })
            .forEach(o => {
                _receivableTokens[o.token.address] = o;
                _trustedAddresses[o.owner.address] = o;
            });

        this._tokensITrust = _receivableTokens;
        this._personsITrust = _trustedAddresses;

        return _receivableTokens;
    }

    /**
     * Gets the personal circles token of this person.
     */
    async getOwnToken(): Promise<CirclesToken | undefined> {
        if (this._tokenAddress) {
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
