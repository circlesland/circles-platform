import {MutationUpsertProfileArgs} from "omo-central-interfaces/dist/types";
import {Context} from "../../context";
import {WnfsClientInterface} from "../../wnfsClientInterface";

export function upsertProfileResolver(wnfs:WnfsClientInterface) {
    return async (parent:any, args:MutationUpsertProfileArgs, context:Context) => {
        const fissionUsername = await context.verifyJwt();
        const profile = await wnfs.profile.upsert({
            create: {
                fissionName: fissionUsername,
                circlesAddress: args.data.circlesAddress ?? undefined,
                fissionRoot: args.data.fissionRoot ?? undefined,
                omoAvatarCid: args.data.omoAvatarCid ?? undefined,
                omoAvatarMimeType: args.data.omoAvatarMimeType ?? undefined,
                omoFirstName: args.data.omoFirstName ?? undefined,
                omoLastName: args.data.omoLastName ?? undefined,
            },
            update: args.data,
            where: {
                fissionName: fissionUsername
            }
        });

        return profile
    };
}