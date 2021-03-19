import {EventBroker} from "omo-utils/dist/eventBroker";
import {Context} from "../../context";
import {from} from "ix/asynciterable";
import {map} from "ix/asynciterable/operators";

export function activitiesSubscription(eventBroker:EventBroker) {
    return {
        subscribe: async (root:any, args:any, context:Context) => {
            const fissionName = await context.verifyJwt();
            let topic = eventBroker.tryGetTopic(fissionName, "activities");
            if (!topic) {
                topic = eventBroker.createTopic(fissionName, "activities");
            }

            const iterator = from(topic.observable).pipe(map(event => {
                console.log("Sending event to subscribers:", event);
                return {
                    activities: event
                }
            }));

            return <any>iterator;
        },
    };
}