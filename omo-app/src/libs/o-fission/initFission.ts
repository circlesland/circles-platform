import {setDappState, tryGetDappState} from "../o-os/loader";
import {FissionAuthState} from "../../dapps/fissionauth/manifest";
import {BehaviorSubject} from "rxjs";

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
