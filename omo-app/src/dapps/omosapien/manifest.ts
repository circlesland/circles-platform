import Me from 'src/dapps/omosapien/views/pages/Me.svelte'
import Profiles from 'src/dapps/omosapien/views/pages/Profiles.svelte'
import Keys from 'src/dapps/omosapien/views/pages/Keys.svelte'
import NoProfile from 'src/dapps/omosapien/views/pages/NoProfile.svelte'
import {omoSapienDefaultActions, omoSapienOverflowActions} from "./data/actions"
import {faUserAstronaut} from "@fortawesome/free-solid-svg-icons";
import {DappManifest} from "../../libs/o-os/interfaces/dappManifest";
import {Profile as ProfileEntity} from "../../libs/o-fission/entities/profile";
import {RunProcess} from "../../libs/o-events/runProcess";
import {createOmoSapien} from "./processes/createOmoSapien/createOmoSapien";
import {setDappState, tryGetDappState} from "../../libs/o-os/loader";
import {FissionAuthState} from "../fissionauth/manifest";
import {runWithDrive} from "../../libs/o-fission/fissionDrive";
import {BehaviorSubject} from "rxjs";
import {Logger} from "../../libs/o-os/interfaces/shell";
import {Envelope} from "../../libs/o-os/interfaces/envelope";
import {ProfileIndex, ProfileIndexData} from "../../libs/o-fission/indexes/profileIndex";

export interface OmoSapienState
{
  myProfile?: ProfileEntity,
  profileIndex?: BehaviorSubject<Envelope<ProfileIndexData>>
}

async function tryInitMyProfile(logger: Logger)
{
  const l = logger.newLogger(`tryInitMyProfile()`);
  l.log("begin");
  await runWithDrive(async fissionDrive =>
  {
    const myProfile = await fissionDrive.profiles.tryGetMyProfile();

    setDappState<OmoSapienState>("omo.sapien:1", currentState =>
    {
      return {
        ...currentState,
        myProfile: myProfile
      };
    });

    l.log("end");
  });
}

async function tryInitOmoDirectory(logger: Logger)
{
  const l = logger.newLogger(`tryInitOmoDirectory()`);
  l.log("begin");

  const omosapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");
  if (!omosapienState.profileIndex)
  {
    const profileIndexData = await ProfileIndex.tryGetProfileIndex();
    if (profileIndexData)
    {
      omosapienState.profileIndex = new BehaviorSubject<Envelope<ProfileIndexData>>({
        payload: profileIndexData
      });

      // Check if the directory includes myself and, if not add me.
      // This is necessary because at the time of the profile creation or update
      // the DNSLink still updates.
      const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
      const myDirectoryEntry = profileIndexData.byFissionName[fissionAuthState.username];
      const isRegistrationCorrect = myDirectoryEntry
        && myDirectoryEntry.firstName == omosapienState.myProfile.firstName
        && myDirectoryEntry.lastName == omosapienState.myProfile.lastName
        && myDirectoryEntry.circlesSafe == omosapienState.myProfile.circlesAddress;

      if (!isRegistrationCorrect)
      {
        window.o.logger.log("You're not registered at the global directory yet or your registration is outdated. Updating it now ...")
        await ProfileIndex.signup(fissionAuthState.username);
      }
    }
  }
}

const noProfilePage = {
  isDefault: true,
  routeParts: ["no-profile"],
  component: NoProfile,
  available: [
    (detail) =>
    {
      window.o.logger.log("routeGuard.detail:", detail);
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
};

let omosapienLogger;

/**
 * Checks if the user already has a profile.
 * If not, starts the process to create a new Omosapien and cancels the loading.
 * @param stack
 * @param runtimeDapp
 */
async function initialize(stack, runtimeDapp)
{
  omosapienLogger = window.o.logger.newLogger(runtimeDapp.id);
  const initLogger = omosapienLogger.newLogger(`initialize(stack:[${stack.length}], runtimeDapp:${runtimeDapp.id})`)
  initLogger.log("begin");

  await tryInitMyProfile(initLogger);

  const omosapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");
  if (!omosapienState.myProfile)
  {
    runtimeDapp.shell.publishEvent(new RunProcess(createOmoSapien));

    initLogger.log("end");
    return {
      cancelDependencyLoading: true,
      initialPage: noProfilePage
    }
  }

  await tryInitOmoDirectory(initLogger);

  initLogger.log("end");
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
      (detail) =>
      {
        window.o.logger.log("routeGuard.detail:", detail);
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
      (detail) =>
      {
        window.o.logger.log("routeGuard.detail:", detail);
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
      (detail) =>
      {
        window.o.logger.log("routeGuard.detail:", detail);
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
