import {PrismaClient} from "@prisma/client";
import {QueryActivitiesArgs} from "omo-central-interfaces/dist/types";
import {Context} from "../../context";
import {profileActivities} from "../edges/profile/activities";

export function activitiesResolver(prisma:PrismaClient) {
    return async (parent:any, args:QueryActivitiesArgs, context: Context) => {
        if (args.query.subjectType !== "profile") {
            throw new Error(`Invalid type: 'activities' can only be queried for 'profiles'.`)
        }
        const profile = await prisma.profile.findUnique({
            where: {
                fissionName: args.query.subjectKey
            }
        });
        if (!profile) {
            throw new Error(`Couldn't find a profile with fissionName '${args.query.subjectKey}'.`);
        }
        const profileActivitiesEdge = profileActivities(prisma);
        return await profileActivitiesEdge(profile, undefined, context);
    };
}