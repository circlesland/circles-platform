import { stateMachine } from "./stateMachine";
import { Shell } from "./interfaces/shell";
import { CirclesHub } from "../o-circles-protocol/circles/circlesHub";
import Web3 from "web3";
import { GnosisSafeProxyFactory } from "../o-circles-protocol/safe/gnosisSafeProxyFactory";
import { ProcessContext } from "../o-processes/interfaces/processContext";
import {ProcessEnvironment} from "../o-processes/interfaces/processEnvironment";
import {config} from "../o-circles-protocol/config";
import * as webnative from "libs/webnative";
import {SessionLog} from "../o-fission/entities/sessionLog";
import {runWithDrive} from "../o-fission/initFission";

export type Ethereum = {
  web3: Web3,
  contracts: {
    hub: CirclesHub,
    safeProxyFactory: GnosisSafeProxyFactory
  }
};

/**
 * Gets all environment properties like the currently logged-on account, token and profile.
 */
export async function getEnvironment(): Promise<ProcessEnvironment>
{
  const cfg = config.getCurrent();
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
  };

  return environment;
}

export async function getProcessContext(): Promise<ProcessContext> {
  return <ProcessContext>{
    environment: await getEnvironment(),
    data: {}
  };
}

const sessionLog:SessionLog = {
  name: Date.now().toString(),
  messages: []
};

export function newLogger(name:string, parent?:any)
{
  return {
    name,
    parent,
    log: (...args: unknown[]) =>
    {
      if (args?.length)
      {
        const remainingArgs = args.splice(1);
        if (remainingArgs.length)
        {
            console.log(`${Date.now()} [${name}]: ${args[0]}`, remainingArgs);
            sessionLog.messages.push({
              message: `${Date.now()} [${name}]: ${args[0]}`,
              args: remainingArgs
            });
        }
        else
        {
          console.log(`${Date.now()} [${name}]: ${args[0]}`);
          sessionLog.messages.push({
            message: `${Date.now()} [${name}]: ${args[0]}`,
            args: undefined
          });
        }
      }
    },
    newLogger: (name:string) => newLogger(name, parent)
  }
}

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
      await drive.sessionLogs.addOrUpdate(sessionLog, true);
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
      await drive.sessionLogs.addOrUpdate(sessionLog, false);
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
      await drive.sessionLogs.addOrUpdate(sessionLog, true);
    });
  }
  catch (e)
  {
    console.error(`Couldn't perform the periodic log-publishing to the fission drive:`, e);
  }
}, 240000);

const logger = newLogger("o");
webnative.setup.debug({
  enabled: true,
  logger: logger.log
});

export const o: Shell = {
  stateMachines: <any>stateMachine,
  wn: webnative,
  logger: logger
}
