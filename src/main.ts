import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import App from "src/App.svelte";
import { OmoEvent } from "./libs/o-events/omoEvent";
import {Authenticated} from "./dapps/odentity/events/authenticated";
import {o} from "./libs/o-os/o";
import {Shell} from "./libs/o-os/interfaces/shell";

dayjs.extend(relativeTime)

declare global {
  interface Window {
    o:Shell
  }
}

window.o = o;

o.shellEvents.subscribe((event:OmoEvent) => {
  if (event.type === "shell.authenticated") {
    window.o.fissionAuth = (<Authenticated>event).fissionAuth;
  }
});

const app = new App({
  target: document.body,
});

export default app;
