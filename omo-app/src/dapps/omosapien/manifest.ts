import Me from 'src/dapps/omosapien/views/pages/Me.svelte'
import Profiles from 'src/dapps/omosapien/views/pages/Profiles.svelte'
import Keys from 'src/dapps/omosapien/views/pages/Keys.svelte'
import { omoSapienDefaultActions, omoSapienOverflowActions } from "./data/actions"
import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { DappManifest } from "../../libs/o-os/interfaces/dappManifest";
import { Profile as ProfileEntity } from "../../libs/o-fission/entities/profile";
import { RunProcess } from "../../libs/o-events/runProcess";
import { createOmoSapien } from "./processes/createOmoSapien/createOmoSapien";
import { setDappState, tryGetDappState } from "../../libs/o-os/loader";
import { FissionAuthState } from "../fissionauth/manifest";
import {runWithDrive} from "../../libs/o-fission/initFission";

export interface Entry {
  fissionName: string;
  circlesSafe: string;
  firstName: string;
  lastName: string;
}

export interface Directory
{
  [fissionName: string]: Entry;
}

export interface LookupDirectory
{
  byFissionName: {
    [fissionName:string]: Entry
  },
  byCirclesSafe: {
    [safeAddress:string]: Entry
  }
}

export interface OmoSapienState {
  myProfile?: ProfileEntity,
  directory?: LookupDirectory
}

async function tryInitMyFs()
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  const fs = fissionAuthState.fission.getValue();
  if (!fs)
  {

  }
}

async function tryInitMyProfile()
{
  await runWithDrive(async fissionDrive =>
  {
    const myProfile = await fissionDrive.profiles.tryGetMyProfile();

    setDappState<OmoSapienState>("omo.sapien:1", currentState => {
      return {
        ...currentState,
        myProfile: myProfile
      };
    });
  });
}

async function tryInitOmoDirectory()
{
  const cid = await fetch("https://directory.omo.earth/directory");
  try
  {
    const directory: Directory = await (await fetch("https://ipfs.io/ipfs/" + (await cid.text()))).json();
    const lookupDirectory: LookupDirectory = {
      byFissionName: directory,
      byCirclesSafe: {}
    };

    Object.values(directory).forEach((o: Entry) =>
    {
      if (!o.circlesSafe)
      {
        return;
      }

      lookupDirectory.byCirclesSafe[o.circlesSafe] = o;
    });

    const omosapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");
    omosapienState.directory = lookupDirectory;

    // Check if the directory includes myself and, if not add me.
    // This is necessary because at the time of the profile creation or update
    // the DNSLink still updates.
    const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
    const myDirectoryEntry = omosapienState.directory.byFissionName[fissionAuthState.username];
    const isRegistrationCorrect = myDirectoryEntry
      && myDirectoryEntry.firstName == omosapienState.myProfile.firstName
      && myDirectoryEntry.lastName == omosapienState.myProfile.lastName
      && myDirectoryEntry.circlesSafe == omosapienState.myProfile.circlesAddress;

    if (!isRegistrationCorrect)
    {
      console.log("You're not registered at the global directory yet or your registration is outdated. Updating it now ...")
      await fetch("https://directory.omo.earth/signup/" + fissionAuthState.username, {
        method: "POST"
      });
      console.log("You're not registered at the global directory yet or your registration is outdated. Updating it now ... Done")
    }
  }
  catch (e)
  {
    console.warn(e);
  }
}

/**
 * Checks if the user already has a profile.
 * If not, starts the process to create a new Omosapien and cancels the loading.
 * @param stack
 * @param runtimeDapp
 */
async function initialize(stack, runtimeDapp) {
  await tryInitMyProfile();

  const omosapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");
  if (!omosapienState.myProfile) {
    runtimeDapp.shell.publishEvent(new RunProcess(createOmoSapien));

    return {
      cancelDependencyLoading: true,
      initialPage: null
    }
  }

  await tryInitOmoDirectory();

  return {
    cancelDependencyLoading: false,
    initialPage: null
  }
}

export const omosapien: DappManifest<OmoSapienState, OmoSapienState> = {
  id: "omo.sapien:1",
  dependencies: ["omo.fission.auth:1"],
  icon: faUserAstronaut,
  title: "OmoSapien",
  routeParts: ["omosapien"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  initialize: initialize,
  pages: [{
    isDefault: true,
    routeParts: ["me"],
    component: Me,
    available: [
      (detail) => {
        console.log("routeGuard.detail:", detail);
        const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
        return fissionAuthState.fission !== undefined
      }
    ],
    userData: {
      showActionBar: true,
      actions: [
        ...omoSapienDefaultActions,
        ...omoSapienOverflowActions
      ]
    }
  }, {
    routeParts: ["profiles"],
    component: Profiles,
    available: [
      (detail) => {
        console.log("routeGuard.detail:", detail);
        const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
        return fissionAuthState.fission !== undefined
      }
    ],
    userData: {
      showActionBar: true,
      actions: [
        ...omoSapienDefaultActions,
        ...omoSapienOverflowActions
      ]
    }
  }, {
    routeParts: ["keys"],
    component: Keys,
    available: [
      (detail) => {
        console.log("routeGuard.detail:", detail);
        const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
        return fissionAuthState.fission !== undefined
      }
    ],
    userData: {
      showActionBar: true,
      actions: [
        ...omoSapienDefaultActions,
        ...omoSapienOverflowActions
      ]
    }
  }]
};
