import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import App from "src/App.svelte";
import { o } from "./libs/o-os/o";
import { Shell } from "./libs/o-os/interfaces/shell";

dayjs.extend(relativeTime)

declare global {
  interface Window {
    o: Shell
  }
}

window.o = o;

const app = new App({
  target: document.body,
});

export default app;
