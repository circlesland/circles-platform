import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import App from "src/App.svelte";
import { Shell } from "./libs/o-os/interfaces/shell";
import { initPathFinder } from "./pathfinderClient";
import {OmoEvent} from "./libs/o-events/omoEvent";
import {ProcessEnvironment} from "./libs/o-processes/interfaces/processEnvironment";
import {config} from "./libs/o-circles-protocol/config";
import {CirclesHub} from "./libs/o-circles-protocol/circles/circlesHub";
import {o} from "./libs/o-os/o";
import {shellEvents} from "./libs/o-os/shellEvents";
import {tryGetDappState} from "./libs/o-os/loader";
import {FissionAuthState} from "./dapps/fissionauth/manifest";
import {OmoSafeState} from "./dapps/safe/manifest";

dayjs.extend(relativeTime)

declare global {
  interface Window {
    o: Shell
  }
}

window.o = o;
window.o = {
  ... window.o,
  events: shellEvents.observable,
  publishEvent: event => shellEvents.publish(event)
};

const app = new App({
  target: document.body,
});

export default app;
