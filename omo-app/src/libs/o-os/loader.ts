import { RuntimeDapp } from "./interfaces/runtimeDapp";
import { RuntimePageManifest } from "./interfaces/runtimePageManifest";


import { omosafe } from "../../dapps/safe/manifest";
import { omoli } from "../../dapps/omoli/manifest";
import { omosapien } from "../../dapps/omosapien/manifest";
import { omowebsite } from "../../dapps/website/manifest";
import { omomarket } from "../../dapps/omomarket/manifest";
import { omofunding } from "../../dapps/omofunding/manifest";
import { omomovies } from "../../dapps/omomovies/manifest";
import { fissiondrive } from "../../dapps/fissiondrive/manifest";
import { fissionauth } from "../../dapps/fissionauth/manifest";
import { omotalk } from "../../dapps/omotalk/manifest";
import { omomusic } from "../../dapps/omomusic/manifest";
import { omobooks } from "../../dapps/omobooks/manifest";

import { DappManifest } from "./interfaces/dappManifest";
import { PageManifest } from "./interfaces/pageManifest";
import { EventBroker } from "./eventBroker";
import { OmoEvent } from "../o-events/omoEvent";
import { shellEvents } from "./shellEvents";

import LoadingIndicator from 'src/libs/o-views/atoms/LoadingIndicator.svelte'
import ErrorIndicator from 'src/libs/o-views/atoms/ErrorIndicator.svelte'
import NotFound from 'src/libs/o-views/pages/NotFound.svelte'
import wrap from "svelte-spa-router/wrap";
import { waitingarea } from "../../dapps/waitingarea/manifest";

const errorIndicator = ErrorIndicator;

export const dapps: DappManifest<any, any>[] = [
  omosapien,
  omosafe,
  omomarket,
  omofunding,
  fissiondrive,
  fissionauth,
  omotalk,
  omomovies,
  omomusic,
  omobooks,
  omoli,
  omowebsite,
  waitingarea
];

export const loadedDapps: RuntimeDapp<any, any>[] = [];

export const dappStates: {
  [dappId: string]: any
} = {};

export function tryGetDappState<T>(dappId: string) {
  const state = dappStates[dappId];
  if (!state)
    return null;
  return <T>state;
}

export function setDappState<T>(dappId: string, setter: (T) => T) {
  const state = dappStates[dappId];
  dappStates[dappId] = setter(state);
}

export function constructAppUrl(dappManifest: DappManifest<any, any>): { appBaseUrl: string, appDefaultRoute: string } {
  const appBaseUrl = dappManifest.routeParts.reduce((p, c) => p + "/" + c, "");
  const appDefaultPage = dappManifest.pages.find(o => o.isDefault) ?? dappManifest.pages[0];
  const appDefaultRoute = appDefaultPage?.routeParts.reduce((p, c) => p + "/" + c, appBaseUrl)
    ?? appBaseUrl;
  return { appBaseUrl, appDefaultRoute };
}

function constructPageUrl(appBaseUrl: string, pageManifest: PageManifest): string {
  let pageUrl = pageManifest.routeParts.reduce((p, c) => p + "/" + c, appBaseUrl);
  if (pageUrl == "")
    pageUrl = "/";

  return pageUrl;
}

let logger;

async function getDappEntryPoint(dappManifest:DappManifest<any, any>, pageManifest:PageManifest) {
  logger = window.o.logger.newLogger("loader");
  const subLogger = logger.newLogger(`getDappEntryPoint(dappManifest: ${dappManifest.id}, pageManifest: ${pageManifest.routeParts.join("/")})`);
  try {
    let runtimeDapp = loadedDapps.find(o => o.id == dappManifest.id);
    if (!runtimeDapp) {
      // The dapp isn't yet loaded
      const freshRuntimeDapp = await loadDapp([], dappManifest);

      if (freshRuntimeDapp.cancelDependencyLoading) {
        subLogger.log("A dependency requested the cancellation of the dependency loading process.")

        if (!freshRuntimeDapp.initialPage) {
          // TODO: Every dapp needs a initial page for all conditions, else the generic loader error is displayed
          throw new Error("The dapp '" + freshRuntimeDapp.runtimeDapp.id  + "' has no 'initialPage' attribute or its value is null.");
        }

        return freshRuntimeDapp.initialPage.component;
      }
      else {
        loadedDapps.push(freshRuntimeDapp.runtimeDapp);
      }
    }

    return pageManifest.component;
  }
  catch (e) {
    window.o.lastError = e;
    return errorIndicator;
  }
}

function constructRoutes(dappManifests: DappManifest<any, any>[]) {
  const routes = {};

  dappManifests.forEach(dappManifest => {
    const appUrls = constructAppUrl(dappManifest);

    dappManifest.pages.forEach(pageManifest => {
      const pageUrl = constructPageUrl(appUrls.appBaseUrl, pageManifest);
      routes[pageUrl] = wrap({
        loadingComponent: LoadingIndicator,
        userData: pageManifest.userData,
        asyncComponent: async () => await getDappEntryPoint(dappManifest, pageManifest)
      });
    });
  });

  routes["*"] = wrap({
    component: NotFound
  });

  return routes;
}

export const dappEvents = new EventBroker();

function createDappTopics(runtimeDapp: RuntimeDapp<any, any>): RuntimeDapp<any, any> {
  const inTopic = dappEvents.createTopic<OmoEvent>(runtimeDapp.id, "in");
  const outTopic = dappEvents.createTopic<OmoEvent>(runtimeDapp.id, "in");
  return <RuntimeDapp<any, any>>{
    ...runtimeDapp,
    shellEvents: shellEvents,
    inEvents: inTopic,
    outEvents: outTopic
  };
}

async function initializeDapp(stack: RuntimeDapp<any, any>[], runtimeDapp: RuntimeDapp<any, any>): Promise<{
  runtimeDapp: RuntimeDapp<any, any>,
  initialPage: PageManifest,
  cancelDependencyLoading: boolean
}> {
  const logPrefix = "  ".repeat(stack.length) + "initializeDapp(" + runtimeDapp.id + "): ";

  let cancelled = false;
  let defaultPage = null;

  // first check if all dependencies are fulfilled
  if (runtimeDapp.dependencies) {
    logger.log(logPrefix + "Initializing " + runtimeDapp.dependencies.length + " dependencies ...");
    const missingDependencies = runtimeDapp.dependencies.filter(dep => !loadedDapps.find(o => o.id == dep));
    if (missingDependencies.length == 0) {
      // All dependencies are already loaded
      logger.log(logPrefix + "All dependencies are already loaded");
    } else {
      // Some or all dependencies need to be loaded
      logger.log(logPrefix + "Some or all dependencies must be loaded before proceeding");

      const nextStack = [...stack, runtimeDapp];
      await Promise.all(missingDependencies.map(async dep => {
        if (cancelled) {
          return;
        }

        const dappManifest = dapps.find(o => o.id == dep);
        if (!dappManifest) {
          throw new Error(logPrefix + "Couldn't find the manifest for dapp '" + dep + "' (Dependency of '" + runtimeDapp.id + "')");
        }
        const loadDappResult = await loadDapp(nextStack, dappManifest);
        if (loadDappResult.cancelDependencyLoading) {
          logger.log(logPrefix + "Loading sequence was cancelled by " + dep + " in " + runtimeDapp.id);
          cancelled = true;
          if (loadDappResult.initialPage) {
            defaultPage = loadDappResult.initialPage;
          }
        }
      }));

      if (cancelled) {
        logger.log(logPrefix + "Loading sequence was cancelled in " + runtimeDapp.id);
        return {
          runtimeDapp,
          cancelDependencyLoading: true,
          initialPage: defaultPage
        };
      } else {
        logger.log(logPrefix + "Loaded all dependencies of " + runtimeDapp.id);
      }
    }
  }

  if (!cancelled) {
    defaultPage = runtimeDapp.pages.find(o => o.isDefault) ?? runtimeDapp.pages[0];
  }

  let initializationResult: {
    initialPage: PageManifest,
    cancelDependencyLoading: boolean,
  } = {
    initialPage: defaultPage,
    cancelDependencyLoading: cancelled
  };

  if (runtimeDapp.initialize) {
    initializationResult = await runtimeDapp.initialize(stack, runtimeDapp);
    logger.log("initializedDappState", initializationResult);
  }

  return {
    runtimeDapp,
    cancelDependencyLoading: initializationResult.cancelDependencyLoading,
    initialPage: initializationResult.initialPage
  };
}

async function loadDapp(stack: RuntimeDapp<any, any>[], dappManifest: DappManifest<any, any>): Promise<{
  runtimeDapp: RuntimeDapp<any, any>,
  initialPage: PageManifest,
  cancelDependencyLoading: boolean
}> {
  const { appBaseUrl, appDefaultRoute } = constructAppUrl(dappManifest);

  let runtimeDapp = <RuntimeDapp<any, any>>{
    ...dappManifest,
    route: appDefaultRoute,
    shell: window.o,
    runtimePages: dappManifest.pages.map(pageManifest => {
      const pageUrl = constructPageUrl(appBaseUrl, pageManifest);
      return <RuntimePageManifest>{
        ...pageManifest,
        route: pageUrl
      };
    })
  };

  runtimeDapp = createDappTopics(runtimeDapp);
  return await initializeDapp(stack, runtimeDapp);
}

const routes = constructRoutes(dapps);
console.log("Registered the following routes: ", routes);

export default routes;
