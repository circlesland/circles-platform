import {OmoEvent} from "omo-events/dist/omoEvent";
import {EventBroker} from "omo-utils/dist/eventBroker";

const eventBroker = new EventBroker();
export const shellEvents = eventBroker.createTopic<OmoEvent>("omo", "shell");
