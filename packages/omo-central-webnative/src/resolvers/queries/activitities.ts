import {QueryActivitiesArgs} from "../../types";
import {Context} from "../../context";
import {profileActivities} from "../edges/profile/activities";
import {WnfsClient} from "../../wnfsClient";

export function activitiesResolver(wnfs:WnfsClient) {
    return async (parent:any, args:QueryActivitiesArgs, context: Context) => {
        if (args.query.subjectType !== "profile") {
            throw new Error(`Invalid type: 'activities' can only be queried for 'profiles'.`)
        }
        const profile = await wnfs.profile.findUnique({
            where: {
                fissionName: args.query.subjectKey
            }
        });
        if (!profile) {
            throw new Error(`Couldn't find a profile with fissionName '${args.query.subjectKey}'.`);
        }
        const profileActivitiesEdge = profileActivities(wnfs);
        return await profileActivitiesEdge(profile, undefined, context);
    };
}