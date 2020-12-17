import Drive from "./pages/Drive.svelte";
import {DappManifest} from "../../libs/o-os/interfaces/dappManifest";
import {faSave} from "@fortawesome/free-solid-svg-icons";

export interface FissionDriveState {}
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
    available: []
  }]
};
