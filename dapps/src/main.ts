import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Shell } from "./libs/o-os/interfaces/shell";
import App from "src/App.svelte";
import {ApiConnection} from "./apiConnection";
import {buildUcan} from "omo-webnative/dist";
import {o} from "./libs/o-os/o";
import {shellEvents} from "./libs/o-os/shellEvents";

dayjs.extend(relativeTime)

const _o: Shell = {
  ... o,
  events: shellEvents.observable,
  publishEvent: event => shellEvents.publish(event),
  graphQLClient: null
};
async function connectToApi() {
  const apiConnection = new ApiConnection("http://localhost:8989/graphql", async () => await buildUcan());
  _o.graphQLClient = await apiConnection.client.subscribeToResult();
  console.log("GraphQL client ready:", _o.graphQLClient);
}
connectToApi();

declare global {
  interface Window {
    o: Shell
  }
}

window.o = _o;

window.o.logger.log("Starting ..", {
  userAgent: navigator.userAgent
})

export default new App({
  target: document.body,
});
