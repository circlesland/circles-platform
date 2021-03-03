import {QueryCirclesWalletsArgs} from "../../types";
import {Context} from "../../context";
import {WnfsClient} from "../../wnfsClient";

export function circlesWalletsResolver(wnfs:WnfsClient) {
    return async (parent:any, args:QueryCirclesWalletsArgs, context: Context) => {
        await context.verifyJwt();

        const address = args.query.address;
        const isTrustedBy = args.query.isTrustedBy;
        const trusts = args.query.trusts;
        const ownTokenAddress = args.query.ownTokenAddress;

        if (!address
            && !isTrustedBy
            && !trusts
            && !ownTokenAddress) {
            throw new Error(`At least one filter parameter must be supplied.`);
        }

        const whereObj: {
            address?: string,
            trust?: {
                AND: {
                    some: {
                        predicate: "RECEIVING_FROM" | "GIVING_TO",
                        objectAddress: string
                    }
                }[]
            },
            ownToken?: {
                address: string
            }
        } = {};

        if (address) {
            whereObj.address = address;
        }
        if (isTrustedBy) {
            if (!whereObj.trust?.AND) {
                whereObj.trust = {
                    AND: []
                }
            }
            whereObj.trust.AND.push({
                some: {
                    predicate: "RECEIVING_FROM",
                    objectAddress: isTrustedBy
                }
            });
        }
        if (trusts) {
            if (!whereObj.trust?.AND) {
                whereObj.trust = {
                    AND: []
                }
            }
            whereObj.trust.AND.push({
                some: {
                    predicate: "GIVING_TO",
                    objectAddress: trusts
                }
            });
        }
        if (ownTokenAddress) {
            whereObj.ownToken = {
                address: ownTokenAddress
            };
        }

        return await wnfs.circlesWallet.findMany({
            where: whereObj
        });
    };
}