import {setDappState, tryGetDappState} from "../o-os/loader";
import {FissionAuthState} from "../../dapps/fissionauth/manifest";
import {FissionDrive} from "./fissionDrive";
import {BehaviorSubject} from "rxjs";
import {Envelope} from "../o-os/interfaces/envelope";

export let initializingDrive:boolean = false;

export async function runWithDrive<TOut>(func:(drive:FissionDrive) => Promise<TOut>) : Promise<TOut>
{
  let fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  if (!fissionAuthState)
  {
    const initAuthSuccess = await initAuth();
    if (!initAuthSuccess)
    {
      throw new Error("Cannot access your fission drive: The authorization failed.");
    }
  }

  fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  if (!fissionAuthState.fission)
  {
    fissionAuthState.fission = new BehaviorSubject<Envelope<FissionDrive>>(null);
  }

  const existingDrive = fissionAuthState.fission.getValue()?.payload;
  if (!existingDrive && !initializingDrive)
  {
    const initFsBegin = Date.now();
    initializingDrive = true;
    // FS is not loaded yet. Load it.
    const drive = new FissionDrive(fissionAuthState.fissionState)
    drive.init().then(() => {
      const current = fissionAuthState.fission.getValue();
      fissionAuthState.fission.next({
        signal: current?.signal,
        payload: drive
      });
      const initFsEnd = Date.now();
      const initFsDuration = (initFsEnd - initFsBegin) / 1000
      window.o.logger.log("initFsDuration", initFsDuration)
      initializingDrive = false;
    });
  }

  return new Promise((resolve, reject) =>
  {
    const sub = fissionAuthState.fission.subscribe(async fissionDrive =>
    {
      if (!fissionDrive || !(fissionDrive.payload instanceof FissionDrive))
        return;

      func(fissionDrive.payload)
        .then(result => {
          resolve(<TOut>result);
          sub.unsubscribe();
        })
        .catch(error => {
          reject(error);
          sub.unsubscribe();
        });
    });
  });
}


export async function initAuth()
{
  const currentAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  if (currentAuthState && currentAuthState.username)
  {
    return true;
  }

  const state = await window.o.wn.initialise({
    permissions: {
      // Will ask the user permission to store
      // your apps data in `private/Apps/{creator}}/{name}`
      app: {
        name: "OmoSapien",
        creator: "MamaOmo",
      },
      fs: {
        publicPaths: ["omo.sapien"],
      },
    },
    loadFileSystem: false
  });

  switch (state.scenario)
  {
    case window.o.wn.Scenario.AuthSucceeded:
    case window.o.wn.Scenario.Continuation:

      try
      {
        // State:
        // state.authenticated    -  Will always be `true` in these scenarios
        // state.newUser          -  If the user is new to Fission
        // state.throughLobby     -  If the user authenticated through the lobby, or just came back.
        // state.username         -  The user's username.
        //
        // ☞ We can now interact with our file system (more on that later)
        setDappState<FissionAuthState>("omo.fission.auth:1", current =>
        {
          const driveSubject = new BehaviorSubject(null);
          return {
            fissionState: state,
            username: state.username,
            fission: driveSubject
          };
        });

        // set a marker in the local storage that indicates whether we've already logged-in
        localStorage.setItem("fissionAuth", JSON.stringify({
          username: state.username
        }));
      }
      catch (e)
      {
        console.error("Something went wrong during the authentication process: ", e);
        return false;
      }
      return true;
    default:
      // Remove the marker if the authentication failed
      localStorage.removeItem("fissionAuth");
      return false;
  }
}
