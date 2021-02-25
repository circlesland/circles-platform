import {FissionDrive, runWithDrive} from "./fissionDrive";
import {buildUcan, initialise, redirectToLobby, Scenario, State} from "omo-webnative/dist";
import {configure} from "omo-webnative/dist/setup";
import {Client, omoCentralUrl} from "omo-central-client/dist/omoCentralClient";
import {decodeUcan} from "../../omo-ucan/dist/decodeUcan";
import {BehaviorSubject} from "rxjs";

const omoCentralClientSubject = new BehaviorSubject<Client | undefined>(undefined);
let ucanValidTo:number|undefined;
let ucanIssuer:string|undefined;
let ucanAudience:string|undefined;

async function ensureOmoCentralConnection(jwt: string)
{
  const decodedJwt = decodeUcan(jwt);
  const connectionCredentialsExpireSoon = ucanValidTo && ucanValidTo < Date.now() / 1000 - 120;
  const issuerChanged = ucanIssuer !== decodedJwt.payload.iss;
  const audienceChanged = ucanAudience !== decodedJwt.payload.aud;
  const changedOrExpiresSoon = connectionCredentialsExpireSoon || issuerChanged || audienceChanged;

  const currentConnection = omoCentralClientSubject.getValue();
  if (currentConnection && !changedOrExpiresSoon) {
    return;
  }

  console.log("Connecting to omo-central ...")
  ucanValidTo = decodedJwt.payload.exp;
  ucanIssuer = decodedJwt.payload.iss;
  ucanAudience = decodedJwt.payload.aud;
  const nextConnection = await Client.connect(omoCentralUrl, jwt);
  if (currentConnection && changedOrExpiresSoon) {
    currentConnection.close();
  }
  omoCentralClientSubject.next(nextConnection);
}

configure({
  enableDebugMode: true,
  additionalDnsLinkResolver:async  fissionUsername => {
    const cid = await Client.fissionRoot(fissionUsername);
    return cid ?? "";
  },
  additionalDnsLinkUpdater: async (jwt, cid) =>
  {
    await ensureOmoCentralConnection(jwt);

    runWithDrive(async drive => {
      const myProfile = await drive.profiles?.tryGetMyProfile();
      if (!myProfile)
        return;

      await omoCentralClientSubject.getValue()?.upsertProfile({
        circlesAddress: myProfile.circlesAddress,
        fissionRoot: cid,
        omoAvatarCid: myProfile.omoAvatarCid,
        omoAvatarMimeType: myProfile.omoAvatarMimeType,
        omoFirstName: myProfile.firstName,
        omoLastName: myProfile.lastName
      });
    }, false);
  }
})

export async function tryToAuthenticate(redirectToLobbyIfNecessary:boolean = true) : Promise<{
  fissionState: State,
  username: string,
  fission: FissionDrive,
  throughLobby: boolean,
  newUser: boolean,
  omoCentralClientSubject: BehaviorSubject<Client | undefined>
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
      const ucan = await buildUcan();
      await ensureOmoCentralConnection(ucan);

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
          newUser: state.newUser,
          omoCentralClientSubject: omoCentralClientSubject
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
