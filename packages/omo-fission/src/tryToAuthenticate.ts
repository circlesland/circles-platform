import {FissionDrive, runWithDrive} from "./fissionDrive";
import {initialise, redirectToLobby, Scenario, State} from "omo-webnative/dist";
import {configure} from "omo-webnative/dist/setup";
import {omoCentralClient} from "omo-central-client/dist/omoCentralClient";

configure({
  enableDebugMode: true,
  additionalDnsLinkResolver:async  fissionUsername => {
    const cid = await omoCentralClient.fissionRoot({
      fields: {
        fissionName: fissionUsername
      }
    });

    return cid.data?.fissionRoot ?? "";
  },
  additionalDnsLinkUpdater: async (jwt, cid) => {
    runWithDrive(async drive => {
      const myProfile = await drive.profiles?.tryGetMyProfile();
      if (!myProfile)
        return;

      omoCentralClient.updateProfile({
        jwt: jwt,
        data: {
          circlesAddress: myProfile.circlesAddress,
          fissionRoot: cid,
          omoAvatarCID: "",
          omoFirstName: myProfile.firstName,
          omoLastName: myProfile.lastName
        }
      })
    }, false);
  }
})

export async function tryToAuthenticate(redirectToLobbyIfNecessary:boolean = true) : Promise<{
  fissionState: State,
  username: string,
  fission: FissionDrive,
  throughLobby: boolean,
  newUser: boolean
}|undefined>
{
  const state = await initialise({
    permissions: {
      app: {
        name: "OmoSapien",
        creator: "MamaOmo",
      },
      fs: {
        publicPaths: ["omo.sapien"],
        privatePaths: []
      },
    },
    loadFileSystem: false
  });

  switch (state.scenario)
  {
    case Scenario.AuthSucceeded:
    case Scenario.Continuation:
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
    case Scenario.NotAuthorised:
      if (redirectToLobbyIfNecessary)
      {
        await redirectToLobby(state.permissions);
      }
      else
      {
        return undefined;
      }
      break;
    default:
      return undefined;
  }
}
