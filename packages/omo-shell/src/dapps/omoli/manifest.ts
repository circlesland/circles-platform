import Dapps from 'src/dapps/omoli/views/pages/Dapps.svelte'
import {faBoxes, faCoins} from "@fortawesome/free-solid-svg-icons";
import {tryGetDappState} from "../../libs/o-os/loader";
import {FissionAuthState} from "../fissionauth/manifest";
import {PageManifest} from "omo-kernel-interfaces/dist/pageManifest";
import {DappManifest} from "omo-kernel-interfaces/dist/dappManifest";

const dappsPage : PageManifest = {
  isDefault: true,
  routeParts: ["dapps"],
  component: Dapps,
  available: [
    (detail) => {
      window.o.logger.log("routeGuard.detail:", detail);
      const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
      return fissionAuthState.fission !== undefined
    }
  ],
  userData: {
    showActionBar: false,
    actions: [{
      type: "trigger",
      pos: "overflow",
      mapping: {
        design: {
          icon: faCoins,
        },
        data: {
          label: "Connect Circles Safe"
        }
      },
      // event: () => new RunProcess(initializeApp)
    }]
  }
};

export interface OmoLiState {}
export const omoli : DappManifest<OmoLiState> = {
  dappId: "omo.li:1",
  isSingleton: true,
  dependencies: ["omo.sapien:1"],
  isHidden: true,
  icon: faBoxes,
  title: "Dapps",
  routeParts: ["omoli"],
  tag: Promise.resolve("mockup"),
  isEnabled: true,
  initialize: async (stack, runtimeDapp) => {
    return {
      // TODO: Change the initialPage
      initialPage: dappsPage,
      cancelDependencyLoading: false
    };
  },
  pages: [dappsPage]
};
