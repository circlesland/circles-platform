import {PrismaClient} from "@prisma/client";
import {MutationUpsertProfileArgs} from "omo-central-interfaces/dist/types";
import {Context} from "../../context";
import {EventBroker} from "omo-utils/dist/eventBroker";

export function upsertProfileResolver(prisma:PrismaClient, eventBroker:EventBroker) {
    return async (parent:any, args:MutationUpsertProfileArgs, context:Context) => {
        const fissionUsername = await context.verifyJwt();
        const profile = await prisma.profile.upsert({
            create: {
                ...args.data,
                fissionName: fissionUsername
            },
            update: args.data,
            where: {
                fissionName: fissionUsername
            }
        });

        return profile
    };
}