import {stateMachine} from "./stateMachine";
import * as webnative from "webnative";
import {EventBroker} from "./eventBroker";
import {Shell} from "./interfaces/shell";
import {OmoEvent} from "../o-events/omoEvent";
import {Authenticated} from "../../dapps/odentity/events/authenticated";
import {config} from "../o-circles-protocol/config";
import {CirclesHub} from "../o-circles-protocol/circles/circlesHub";
import {ProcessEnvironment} from "../o-processes/interfaces/processEnvironment";
import {GnosisSafeProxy} from "../o-circles-protocol/safe/gnosisSafeProxy";
import {BN} from "ethereumjs-util";
import {FissionDrive} from "../o-fission/fissionDrive";
import {Profile} from "../o-fission/entities/profile";
import {KeyPair} from "../o-fission/entities/keyPair";
import {Address} from "../o-circles-protocol/interfaces/address";
import Web3 from "web3";
import {GnosisSafeProxyFactory} from "../o-circles-protocol/safe/gnosisSafeProxyFactory";
import {ProcessContext} from "../o-processes/interfaces/processContext";
import {Person} from "../o-circles-protocol/model/person";
import {Erc20Token} from "../o-circles-protocol/token/erc20Token";

const eventBroker = new EventBroker();
const shellEvents = eventBroker.createTopic("omo", "shell");

shellEvents.observable.subscribe((event:OmoEvent) => {
  if (event.type === "shell.authenticated") {
    window.o.fission = new FissionDrive((<Authenticated>event).fissionAuth);
  }
});

export type Me = {
  myData?:FissionDrive,
  myProfile?:Profile,
  myKey?:KeyPair,
  myAddress?:Address,
  mySafe?:GnosisSafeProxy,
  myToken?:Erc20Token,
  myAddressXDaiBalance?:BN,
  mySafeXDaiBalance?:BN
};

export type Ethereum = {
  web3:Web3,
  contracts: {
    hub: CirclesHub,
    safeProxyFactory: GnosisSafeProxyFactory
  }
};

export async function getEnvironment(): Promise<ProcessEnvironment>
{
  const cfg = config.getCurrent();
  const web3 = cfg.web3();

  const myData = window.o.fission;

  const me:Me = {
    myData: myData
  };

  me.myKey = await myData?.keys.tryGetMyKey();
  me.myProfile = await myData?.profiles.tryGetMyProfile();

  const eth:Ethereum = {
    web3: web3,
    contracts: {
      hub: new CirclesHub(web3, cfg.HUB_ADDRESS),
      safeProxyFactory: new GnosisSafeProxyFactory(
        web3,
        cfg.PROXY_FACTORY_ADDRESS,
        cfg.GNOSIS_SAFE_ADDRESS)
    }
  };

  if (me.myKey)
  {
    if (!me.myKey.privateKey)
    {
      throw new Error("Integrity error: The 'me' key's 'privateKey'-property has no value.");
    }

    me.myAddress = web3.eth.accounts.privateKeyToAccount(me.myKey.privateKey).address;
    me.myAddressXDaiBalance = new BN(await web3.eth.getBalance(me.myAddress));
  }

  if (me.myProfile)
  {
    if (me.myProfile?.circlesAddress)
    {
      me.mySafe = new GnosisSafeProxy(web3, me.myAddress, me.myProfile.circlesAddress);
    }
  }

  if (me.mySafe)
  {
    me.mySafeXDaiBalance = new BN(await web3.eth.getBalance(me.mySafe.address));

    const p = new Person(eth.contracts.hub, me.mySafe.address);
    me.myToken = await p.getOwnToken();
  }

  return <ProcessEnvironment> {
    fission: myData,
    eth: eth,
    me: me
  };
}

export async function getProcessContext(): Promise<ProcessContext>
{
  return <ProcessContext>{
    environment: await getEnvironment(),
    data: {}
  };
}

export const o:Shell = {
  events: shellEvents.observable,
  publishEvent: event => shellEvents.publish(event),
  fission: undefined,
  getEnvironment: async () => await getEnvironment(),
  stateMachines: <any>stateMachine,
  wn: webnative
}
