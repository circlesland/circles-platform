import {QueryFissionRootArgs} from "omo-central-interfaces/dist/types";
import {whereProfile} from "./profiles";
import {WnfsClientInterface} from "../../wnfsClientInterface";

export function fissionRootResolver(wnfs:WnfsClientInterface) {
    return async (parent:any, args:QueryFissionRootArgs) => {
        const q = whereProfile(args);
        const result = await wnfs.profile.findUnique({
            where: {
                ...q
            },
            select: {
                fissionRoot: true
            }
        });

        if (!result?.fissionRoot) {
            throw new Error(`Couldn't find a fission root with the provided arguments.`);
        }
        return result.fissionRoot;
    };
}