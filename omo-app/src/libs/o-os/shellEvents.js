import { EventBroker } from "./eventBroker";
const eventBroker = new EventBroker();
export const shellEvents = eventBroker.createTopic("omo", "shell");
