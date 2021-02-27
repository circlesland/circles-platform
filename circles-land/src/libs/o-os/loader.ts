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

import { DappManifest } from "omo-kernel-interfaces/dist/dappManifest";
import { PageManifest } from "omo-kernel-interfaces/dist/pageManifest";
import { RuntimeDapp } from "omo-kernel-interfaces/dist/runtimeDapp";
import { OmoEvent } from "omo-events/dist/omoEvent";
import { shellEvents } from "./shellEvents";

import LoadingIndicator from 'src/libs/o-views/atoms/LoadingIndicator.svelte'
import ErrorIndicator from 'src/libs/o-views/atoms/ErrorIndicator.svelte'
import NotFound from 'src/libs/o-views/pages/NotFound.svelte'
import wrap from "svelte-spa-router/wrap";
import { waitingarea } from "../../dapps/waitingarea/manifest";
import {EventBroker} from "omo-utils/dist/eventBroker";
import {Generate} from "omo-utils/dist/generate";
import {identity} from "../../dapps/identity/manifest";

const errorIndicator = ErrorIndicator;

export const dapps: DappManifest<any>[] = [
  omosapien,
  identity,
  omosafe,
  omomarket,
  omotalk,
  omofunding,
  fissiondrive,
  fissionauth,
  omomovies,
  omomusic,
  omobooks,
  omoli,
  omowebsite,
  waitingarea
];

export const loadedDapps: RuntimeDapp<any>[] = [];

export function constructAppUrl(dappManifest: DappManifest<any>): { appBaseUrl: string, appDefaultRoute: string } {
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

async function getDappEntryPoint(dappManifest:DappManifest<any>, pageManifest:PageManifest) {
  logger = window.o.logger.newLogger("loader");
  const subLogger = logger.newLogger(`getDappEntryPoint(dappManifest: ${dappManifest.dappId}, pageManifest: ${pageManifest.routeParts.join("/")})`);
  try {
    let runtimeDapp = loadedDapps.find(o => o.dappId == dappManifest.dappId);
    if (!runtimeDapp) {
      // The dapp isn't yet loaded
      const freshRuntimeDapp = await loadDapp([], dappManifest);

      if (freshRuntimeDapp.cancelDependencyLoading) {
        subLogger.log("A dependency requested the cancellation of the dependency loading process.")

        if (!freshRuntimeDapp.initialPage) {
          // TODO: Every dapp needs a initial page for all conditions, else the generic loader error is displayed
          throw new Error("The dapp '" + freshRuntimeDapp.runtimeDapp.dappId  + "' has no 'initialPage' attribute or its value is null.");
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

function constructRoutes(dappManifests: DappManifest<any>[]) {
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

function createDappTopics(runtimeDapp: RuntimeDapp<any>): RuntimeDapp<any> {
  const inTopic = dappEvents.createTopic<OmoEvent>(runtimeDapp.dappId, "in");
  const outTopic = dappEvents.createTopic<OmoEvent>(runtimeDapp.dappId, "in");
  return <RuntimeDapp<any>>{
    ...runtimeDapp,
    shellEvents: shellEvents,
    inEvents: inTopic,
    outEvents: outTopic
  };
}

async function initializeDapp(stack: RuntimeDapp<any>[], runtimeDapp: RuntimeDapp<any>): Promise<{
  runtimeDapp: RuntimeDapp<any>,
  initialPage: PageManifest,
  cancelDependencyLoading: boolean
}> {
  const logPrefix = "  ".repeat(stack.length) + "initializeDapp(" + runtimeDapp.dappId + "): ";

  let cancelled = false;
  let defaultPage = null;

  // first check if all dependencies are fulfilled
  if (runtimeDapp.dependencies) {
    logger.log(logPrefix + "Initializing " + runtimeDapp.dependencies.length + " dependencies ...");
    const missingDependencies = runtimeDapp.dependencies.filter(dep => !loadedDapps.find(o => o.dappId == dep));
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

        const dappManifest = dapps.find(o => o.dappId == dep);
        if (!dappManifest) {
          throw new Error(logPrefix + "Couldn't find the manifest for dapp '" + dep + "' (Dependency of '" + runtimeDapp.dappId + "')");
        }
        const loadDappResult = await loadDapp(nextStack, dappManifest);
        if (loadDappResult.cancelDependencyLoading) {
          logger.log(logPrefix + "Loading sequence was cancelled by " + dep + " in " + runtimeDapp.dappId);
          cancelled = true;
          if (loadDappResult.initialPage) {
            defaultPage = loadDappResult.initialPage;
          }
        }
      }));

      if (cancelled) {
        logger.log(logPrefix + "Loading sequence was cancelled in " + runtimeDapp.dappId);
        return {
          runtimeDapp,
          cancelDependencyLoading: true,
          initialPage: defaultPage
        };
      } else {
        logger.log(logPrefix + "Loaded all dependencies of " + runtimeDapp.dappId);
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

async function loadDapp(stack: RuntimeDapp<any>[], dappManifest: DappManifest<any>): Promise<{
  runtimeDapp: RuntimeDapp<any>,
  initialPage: PageManifest,
  cancelDependencyLoading: boolean
}> {
  const { appBaseUrl, appDefaultRoute } = constructAppUrl(dappManifest);

  let runtimeDapp = <RuntimeDapp<any>>{
    ...dappManifest,
    route: appDefaultRoute,
    dappId: dappManifest.isSingleton
      ? dappManifest.dappId
      : `${dappManifest.dappId}:${Generate.randomHexString()}`
    // runtimePages: dappManifest.pages.map(pageManifest => {
      // const pageUrl = constructPageUrl(appBaseUrl, pageManifest);
      // return <RuntimePageManifest>{
      //   ...pageManifest,
      //   route: pageUrl
      // };
  }

  runtimeDapp = createDappTopics(runtimeDapp);
  return await initializeDapp(stack, runtimeDapp);
}

const routes = constructRoutes(dapps);
console.log("Registered the following routes: ", routes);

export default routes;
