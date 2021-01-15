import {OmoEvent} from "../o-events/omoEvent";
import {EventBroker} from "omo-utils/dist/eventBroker";

const eventBroker = new EventBroker();
export const shellEvents = eventBroker.createTopic<OmoEvent>("omo", "shell");
