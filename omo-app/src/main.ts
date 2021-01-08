import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Shell } from "./libs/o-os/interfaces/shell";
import {o} from "./libs/o-os/o";
import {shellEvents} from "./libs/o-os/shellEvents";

dayjs.extend(relativeTime)

declare global {
  interface Window {
    o: Shell
  }
}

window.o = {
  ... o,
  events: shellEvents.observable,
  publishEvent: event => shellEvents.publish(event)
};

window.o.logger.log("Starting ..", {
  userAgent: navigator.userAgent
})

import App from "src/App.svelte";
const app = new App({
  target: document.body,
});

export default app;
