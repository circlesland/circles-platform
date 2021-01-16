import { stateMachine } from "./stateMachine";
import { Shell } from "./interfaces/shell";
// import { CirclesHub } from "../o-circles-protocol/circles/circlesHub";
// import Web3 from "omo-quirks/dist/web3";
// import { GnosisSafeProxyFactory } from "../o-circles-protocol/safe/gnosisSafeProxyFactory";
// import { ProcessContext } from "../o-processes/interfaces/processContext";
// import {ProcessEnvironment} from "../o-processes/interfaces/processEnvironment";
// import {config} from "../o-circles-protocol/config";
// import * as webnative from "libs/webnative";
// import {SessionLog} from "../o-fission/entities/sessionLog";
// import {runWithDrive} from "../o-fission/fissionDrive";
import {newLogger} from "omo-utils/dist/logger";
import {ProcessEnvironment} from "omo-process/dist/processEnvironment";
import {ProcessContext} from "omo-process/dist/processContext";
import {SessionLog} from "omo-models/dist/sessionLog";

/*
export type Ethereum = {
  web3: Web3,
  contracts: {
    hub: CirclesHub,
    safeProxyFactory: GnosisSafeProxyFactory
  }
};
 */

/**
 * Gets all environment properties like the currently logged-on account, token and profile.
 */
export async function getEnvironment(): Promise<ProcessEnvironment>
{
  /*const cfg = config.getCurrent();
  const web3 = cfg.web3();

  const eth: Ethereum = {
    web3: web3,
    contracts: {
      hub: new CirclesHub(web3, cfg.HUB_ADDRESS),
      safeProxyFactory: new GnosisSafeProxyFactory(
        web3,
        cfg.PROXY_FACTORY_ADDRESS,
        cfg.GNOSIS_SAFE_ADDRESS)
    }
  };

  const environment = <ProcessEnvironment>{
    eth: eth
  };*/

  //return environment;
  return <any>{};
}

export async function getProcessContext(): Promise<ProcessContext> {
  return <ProcessContext>{
    // environment: await getEnvironment(),
    data: {}
  };
}

let sessionLog:SessionLog = {
  name: Date.now().toString(),
  messages: []
};
/*
window.addEventListener('error', async function(event)
{
  try
  {
    logger.log("An error occurred:", {
      error: event.error,
      file: event.filename,
      line: event.lineno,
      message: event.message
    });
    await runWithDrive(async drive =>
    {
      await drive.sessionLogs.addOrUpdateEntity(sessionLog, true);
    });
  } catch (e)
  {
    console.error(`Couldn't write the error log to the fission drive:`, e);
  }
})


setInterval(async () => {
  try
  {
    await runWithDrive(async drive =>
    {
      await drive.sessionLogs.addOrUpdateEntity(sessionLog, false);
      if (sessionLog.messages.length > 10000) {
        sessionLog = {
          name: sessionLog.name + "_" + Date.now(),
          messages: []
        };
      }
    });
  }
  catch (e)
  {
    console.error(`Couldn't perform the periodic log-flush to the fission drive:`, e);
  }
}, 30000);

setInterval(async () => {
  try
  {
    await runWithDrive(async drive =>
    {
      await drive.sessionLogs.addOrUpdateEntity(sessionLog, true);
      if (sessionLog.messages.length > 10000) {
        sessionLog = {
          name: sessionLog.name + "_" + Date.now(),
          messages: []
        };
      }
    });
  }
  catch (e)
  {
    console.error(`Couldn't perform the periodic log-publishing to the fission drive:`, e);
  }
}, 240000);
 */

const logger = newLogger("o", undefined, message => {
  sessionLog.messages.push(message);
});
/*
webnative.setup.debug({
  enabled: true,
  logger: logger.log
});

 */

export const o: Shell = {
  stateMachines: <any>stateMachine,
  logger: logger
}
