import * as webnative from "webnative";
import {FissionDrive} from "./fissionDrive";

export async function tryToAuthenticate() : Promise<{
  fissionState: webnative.State,
  username: string,
  fission: FissionDrive,
  throughLobby: boolean,
  newUser: boolean
}|undefined>
{
  const state = await webnative.initialise({
    permissions: {
      app: {
        name: "OmoSapien",
        creator: "MamaOmo",
      },
      fs: {
        privatePaths: [],
        publicPaths: [],
      },
    },
    loadFileSystem: false
  });

  switch (state.scenario)
  {
    case webnative.Scenario.AuthSucceeded:
    case webnative.Scenario.Continuation:
      try
      {
        // State:
        // state.authenticated    -  Will always be `true` in these scenarios
        // state.newUser          -  If the user is new to Fission
        // state.throughLobby     -  If the user authenticated through the lobby, or just came back.
        // state.username         -  The user's username.
        //
        // ☞ We can now interact with our file system (more on that later)
        return {
          fissionState: state,
          username: state.username,
          fission: new FissionDrive(state),
          throughLobby: state.throughLobby,
          newUser: state.newUser
        };
      }
      catch (e)
      {
        console.error("Something went wrong during the authentication process: ", e);
        return undefined;
      }
    default:
      return undefined;
  }
}
