import { stateMachine } from "./stateMachine";
import { Shell } from "./interfaces/shell";
import { CirclesHub } from "../o-circles-protocol/circles/circlesHub";
import { GnosisSafeProxy } from "../o-circles-protocol/safe/gnosisSafeProxy";
import { BN } from "ethereumjs-util";
import { FissionDrive } from "../o-fission/fissionDrive";
import { Profile } from "../o-fission/entities/profile";
import { KeyPair } from "../o-fission/entities/keyPair";
import { Address } from "../o-circles-protocol/interfaces/address";
import Web3 from "web3";
import { GnosisSafeProxyFactory } from "../o-circles-protocol/safe/gnosisSafeProxyFactory";
import { ProcessContext } from "../o-processes/interfaces/processContext";
import { Erc20Token } from "../o-circles-protocol/token/erc20Token";
import {ProcessEnvironment} from "../o-processes/interfaces/processEnvironment";
import {config} from "../o-circles-protocol/config";
import * as webnative from "webnative";

export type Me = {
  myData?: FissionDrive,
  myProfile?: Profile,
  myKey?: KeyPair,
  myAddress?: Address,
  mySafe?: GnosisSafeProxy,
  myToken?: Erc20Token,
  myAddressXDaiBalance?: BN,
  mySafeXDaiBalance?: BN
  myDisplayName():string;
};

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

webnative.setup.debug({ enabled: true });
export const o: Shell = {
  stateMachines: <any>stateMachine,
  wn: webnative
}
