import Contacts from './views/pages/Contacts.svelte';
import ProfilePage from './views/pages/Profile.svelte';
import {
  faAddressBook,
  faPeopleArrows,
  faPlus, faUser,
} from "@fortawesome/free-solid-svg-icons";
import {PageManifest} from "omo-kernel-interfaces/dist/pageManifest";
import {DappManifest} from "omo-kernel-interfaces/dist/dappManifest";
import {setDappState, tryGetDappState} from "omo-kernel/dist/kernel";
import {FissionAuthState} from "omo-fission/dist/manifest";
import {QuickAction} from "omo-kernel-interfaces/dist/quickAction";
import {runWithDrive} from "omo-fission/dist/fissionDrive";
import {Profile} from "omo-central/dist/generated";

const defaultActions: QuickAction[] = [
  {
    type: "route",
    pos: "1",
    mapping: {
      design: {
        icon: faUser
      },
      data: {
        label: "Profile"
      }
    },
    route: "#/identity/profile"
  }, {
    type: "route",
    pos: "2",
    mapping: {
      design: {
        icon: faAddressBook,
      },
      data: {
        label: "Contacts"
      }
    },
    route: "#/identity/contacts"
  }
];

const myProfile : PageManifest = {
  isDefault: true,
  routeParts: ["profile"],
  component: ProfilePage,
  available: [
    (detail) => {
      window.o.logger.log("routeGuard.detail:", detail);
      const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
      return fissionAuthState.state.username !== undefined
    }
  ],
  userData: {
    showActionBar: true,
    actions: defaultActions
  }
};

const myContacts : PageManifest = {
  isDefault: true,
  routeParts: ["contacts"],
  component: Contacts,
  available: [
    (detail) => {
      window.o.logger.log("routeGuard.detail:", detail);
      const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
      return fissionAuthState.state.username !== undefined
    }
  ],
  userData: {
    showActionBar: true,
    actions: [
      ...defaultActions,
      {
      mapping: {
        data: {
          label: "Add new contact"
        },
        design: {
          icon: faPlus
        }
      },
      pos: "overflow",
      type: "trigger",
      event: () => {
        throw new Error(`NotImplemented`)
      }
    }]
  }
};

async function tryInitMyProfile()
{
  await runWithDrive(async fissionDrive =>
  {
    const myProfile = await fissionDrive.profiles.tryGetMyProfile();

    setDappState<IdentityState>("omo.identity:1", currentState =>
    {
      return {
        ...currentState,
        myProfile: {
          ...myProfile,
          fissionName: myProfile.fissionName
        }
      };
    });
  });
}

export interface IdentityState {
  myProfile: Profile
}

export const identity : DappManifest<IdentityState> = {
  dappId: "omo.identity:1",
  isSingleton: true,
  dependencies: ["omo.sapien:1"],
  isHidden: false,
  icon: faPeopleArrows,
  title: "Profile & Contacts",
  routeParts: ["identity"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  initialize: async (stack, runtimeDapp) => {
    await tryInitMyProfile();
    return {
      initialPage: myProfile,
      cancelDependencyLoading: false
    };
  },
  pages: [myProfile, myContacts]
};
