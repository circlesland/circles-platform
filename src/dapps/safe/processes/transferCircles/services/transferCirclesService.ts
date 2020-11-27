import {TransferCirclesContext} from "../transferCircles";
import {Person} from "../../../../../libs/o-circles-protocol/model/person";
import {config} from "../../../../../libs/o-circles-protocol/config";
import {BN} from "ethereumjs-util";
import {CirclesHub} from "../../../../../libs/o-circles-protocol/circles/circlesHub";

export const transferCirclesService = async (context: TransferCirclesContext) =>
{
    try
    {
        const cfg = config.getCurrent();
        const web3 = cfg.web3();

        // 1. Get all tokens the recipient trusts
        const recipient = new Person(new CirclesHub(web3, cfg.HUB_ADDRESS), context.transfer.recipient.data);
        const recipientTrustedTokens = await recipient.getTokensITrust();

        // 2. Get all tokens I have
        const myTokens = await context.person.getTokenBalances();

        // 3. Find all tokens that the recipient accepts
        const exchangeableTokens = myTokens.filter(myToken => recipientTrustedTokens[myToken.token]);
        if (exchangeableTokens.length == 0)
        {
            throw new Error(`Cannot send ${web3.utils.fromWei(context.transfer.value.data)} circles to ${context.transfer.recipient.data} because the recipient trusts none of your tokens.`)
        }

        // 4. Check if the balance of all accepted tokens is high enough
        const exchangeableTokenBalance = exchangeableTokens.reduce((p, c) => p.add(c.balance), new BN("0"));
        if (exchangeableTokenBalance.lt(context.transfer.value.data))
        {
            throw new Error(`Cannot send ${web3.utils.fromWei(context.transfer.value.data)} circles to ${context.transfer.recipient.data} because you don't have enough tokens of the kind the recipient accepts.`)
        }

        // 5. Distribute the amount over all accepted tokens
        const maxBalance = exchangeableTokens.reduce((p, c) => c.balance.gt(p) ? c.balance : p, new BN("0"));

    }
    catch (e) {
        console.error(e);
        throw  e;
    }
        return Promise.resolve();
}
