import Drive from "./views/pages/Drive.svelte";
import {DappManifest} from "../../libs/o-os/interfaces/dappManifest";
import {faSave, faUserCircle} from "@fortawesome/free-solid-svg-icons";
import {QuickAction} from "../../libs/o-os/types/quickAction";

export interface FissionDriveState {
}

export const defaultActions: QuickAction[] = [
  {
    type: "route",
    pos: "4",
    mapping: {
      design: {
        icon: faUserCircle,
      },
      data: {
        label: "Home",
      }
    },
    route: "#/omoli/dapps"
  }
];

export const fissiondrive : DappManifest<FissionDriveState,FissionDriveState> = {
  id: "omo.fission.drive:1",
  dependencies: ["omo.fission.auth:1"],
  isHidden: false,
  icon: faSave,
  title: "Fission Drive",
  routeParts: ["fissiondrive"],
  tag: Promise.resolve("beta"),
  isEnabled: true,
  pages: [{
    isDefault: true,
    routeParts: ["drive"],
    component: Drive,
    available: [],
    userData: {
      showActionBar: true,
      actions: [
        ...defaultActions
      ]
    }
  }]
};
