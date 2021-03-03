import {MutationUpsertProfileArgs} from "../../types";
import {Context} from "../../context";
import {WnfsClient} from "../../wnfsClient";

export function upsertProfileResolver(wnfs:WnfsClient) {
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