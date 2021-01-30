import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { o } from "./libs/o-os/o";
import { shellEvents } from "./libs/o-os/shellEvents";
dayjs.extend(relativeTime);
window.o = Object.assign(Object.assign({}, o), { events: shellEvents.observable, publishEvent: event => shellEvents.publish(event) });
window.o.logger.log("Starting ..", {
    userAgent: navigator.userAgent
});
import App from "src/App.svelte";
export default new App({
    target: document.body,
});
