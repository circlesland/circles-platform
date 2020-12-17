import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import App from "src/App.svelte";
import { Shell } from "./libs/o-os/interfaces/shell";
import { initPathFinder } from "./pathfinderClient";
import {OmoEvent} from "./libs/o-events/omoEvent";
import {FissionDrive} from "./libs/o-fission/fissionDrive";
import {Authenticated} from "./dapps/fissionauth/events/authenticated";
import {ProcessEnvironment} from "./libs/o-processes/interfaces/processEnvironment";
import {config} from "./libs/o-circles-protocol/config";
import {CirclesHub} from "./libs/o-circles-protocol/circles/circlesHub";
import {o} from "./libs/o-os/o";
import {shellEvents} from "./libs/o-os/shellEvents";

dayjs.extend(relativeTime)

let initialized:boolean = false;

shellEvents.observable.subscribe(async (event: OmoEvent) =>
{
  if (event.type === "shell.authenticated")
  {
    window.o.fission = new FissionDrive((<Authenticated>event).fissionAuth);
  }
  else if (event.type === "shell.gotSafe" && !initialized)
  {
    console.log("GotSafe: ", event)
    initialized = true;
    const env = await window.o.getEnvironment();
    await bootstrap(env);
  }
});

/**
 * Creates all event sources, registers them at the EventStore and makes sure that all current events are available
 * before returning.
 */
export async function bootstrap(env:ProcessEnvironment) {

  // 1) Init a HubAccount
  const cfg = config.getCurrent();
  const web3 = cfg.web3();
  const circlesHub = new CirclesHub(web3, cfg.HUB_ADDRESS);

  const counterPromises = (await env.fission.events.counters.listNames())
    .map(async counterName => await env.fission.events.counters.tryGetByName(counterName));

  const counters = {};
  (await Promise.all(counterPromises)).forEach(counter => counters[counter.name] = counter.value);

  console.log("Counters:", counters);

  // 2) Query my signup at the circles hub
  const mySignup = circlesHub.queryEvents(CirclesHub.queryPastSignup(
    env.me.mySafe.address,
    counters["mySignup"]
      ? counters["mySignup"] + 1
      : null));
  await env.fission.events.attachEventSource("mySignup", mySignup);

  // 3) Query all my trust connections
  const myIncomingTrusts = circlesHub.queryEvents(CirclesHub.queryPastTrusts(
    null,
    env.me.mySafe.address,
    counters["myIncomingTrusts"]
      ? counters["myIncomingTrusts"] + 1
      : null));
  await env.fission.events.attachEventSource("myIncomingTrusts", myIncomingTrusts);

  const myOutgoingTrusts = circlesHub.queryEvents(CirclesHub.queryPastTrusts(
    env.me.mySafe.address,
    null,
    counters["myOutgoingTrusts"]
      ? counters["myOutgoingTrusts"] + 1
      : null));
  await env.fission.events.attachEventSource("myOutgoingTrusts", myOutgoingTrusts);

  await env.fission.events.flush();
  env.fission.events.clearBuffer();

  const allCachedIncomingTrusts = await env.fission.events.loadEventsFromFs("myIncomingTrusts");
  // console.log("allCachedIncomingTrusts", allCachedIncomingTrusts);

  // 2) Query the signups of my incoming trusts
  const trustingSafeSignups = circlesHub.queryEvents(CirclesHub.queryPastSignups(
    allCachedIncomingTrusts.map(o => (JSON.parse(o.data)).canSendTo),
    counters["trustingSafeSignups"]
      ? counters["trustingSafeSignups"] + 1
      : null));
  await env.fission.events.attachEventSource("trustingSafeSignups", trustingSafeSignups);

  const allCachedOutgoingTrusts = await env.fission.events.loadEventsFromFs("myOutgoingTrusts");
  // console.log("allCachedOutgoingTrusts", allCachedOutgoingTrusts);

  const trustedSafeSignups = circlesHub.queryEvents(CirclesHub.queryPastSignups(
    allCachedOutgoingTrusts.map(o => (JSON.parse(o.data)).user),
    counters["trustedSafeSignups"]
      ? counters["trustedSafeSignups"] + 1
      : null));
  await env.fission.events.attachEventSource("trustedSafeSignups", trustedSafeSignups);

  await env.fission.events.flush();
  env.fission.events.clearBuffer();
}

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
