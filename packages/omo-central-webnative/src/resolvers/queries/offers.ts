import {QueryOffersArgs, RequireFields} from "omo-central-interfaces/dist/types";
import {WnfsClientInterface} from "../../wnfsClientInterface";
import {Offer} from "omo-central-interfaces/dist/types";

export function whereOffer(args: RequireFields<QueryOffersArgs, never>) {
    const q: { [key: string]: any } = {};
    if (!args.query) {
        throw new Error(`No query fields have been specified`);
    }
    Object.keys(args.query ?? {})
        .filter(key => !key.endsWith("_lt") && !key.endsWith("_gt"))
        .map(key => {
            return {
                key: key,
                // @ts-ignore
                value: args.query[key]
            }
        })
        .filter(kv => kv.value)
        .forEach(kv => {
            q[kv.key] = kv.value;
        });

    if (args.query.publishedAt_gt || args.query.publishedAt_lt)
    {
        q.publishedAt = {};
        if (args.query.publishedAt_gt) {
            q.publishedAt.gt = new Date(args.query.publishedAt_gt)
        }
        if (args.query.publishedAt_lt) {
            q.publishedAt.lt = new Date(args.query.publishedAt_lt)
        }
    }
    if (args.query.unlistedAt_gt || args.query.unlistedAt_lt)
    {
        q.unlistedAt = {};
        if (args.query.unlistedAt_gt) {
            q.unlistedAt.gt = new Date(args.query.unlistedAt_gt)
        }
        if (args.query.unlistedAt_lt) {
            q.unlistedAt.lt = new Date(args.query.unlistedAt_lt)
        }
    }

    if (Object.keys(q).length === 0) {
        throw new Error(`At least one query field must be specified.`);
    }

    return q;
}

export function offersResolver(wnfs:WnfsClientInterface) {
    return async (parent:any, args:QueryOffersArgs) => {
        const q = whereOffer(args);
        const result = await wnfs.offer.findMany({
            where: {
                ...q
            }
        });

        return <any[]>result.map((offer:Offer) => {
            return {
                ...offer,
                publishedAt: offer.publishedAt,
                unlistedAt: offer.unlistedAt
            }
        });
    };
}