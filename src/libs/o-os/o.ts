import { stateMachine } from "./stateMachine";
import * as webnative from "webnative";
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

export async function getProcessContext(): Promise<ProcessContext> {
  return <ProcessContext>{
    data: {}
  };
}

export const o: Shell = {
  stateMachines: <any>stateMachine,
  wn: webnative
}
