import Drive from "./views/pages/Drive.svelte";
import {faSave, faUserCircle} from "@fortawesome/free-solid-svg-icons";
import {QuickAction} from "omo-kernel-interfaces/dist/quickAction";
import {DappManifest} from "omo-kernel-interfaces/dist/dappManifest";

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
  isSingleton: true,
  dependencies: ["omo.li:1"],
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
