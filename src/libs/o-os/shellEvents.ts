import {EventBroker} from "./eventBroker";
import {OmoEvent} from "../o-events/omoEvent";

const eventBroker = new EventBroker();
export const shellEvents = eventBroker.createTopic<OmoEvent>("omo", "shell");
