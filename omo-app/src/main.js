import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import App from "src/App.svelte";
import { o } from "./libs/o-os/o";
import { shellEvents } from "./libs/o-os/shellEvents";
dayjs.extend(relativeTime);
window.o = Object.assign(Object.assign({}, o), { events: shellEvents.observable, publishEvent: event => shellEvents.publish(event) });
const app = new App({
    target: document.body,
});
export default app;
