import WaitingArea from "./pages/WaitingArea.svelte";
import {faHourglass} from "@fortawesome/free-solid-svg-icons";
import {DappManifest} from "omo-kernel-interfaces/dist/dappManifest";

export interface WaitingAreaState {}
export const waitingarea : DappManifest<WaitingAreaState> = {
  dappId: "omo.waitingarea:1",
  isSingleton: true,
  dependencies: [],
  isHidden: true,
  icon: faHourglass,
  title: "Waiting area",
  routeParts: ["waiting-area"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  pages: [{
    isDefault: true,
    routeParts: ["please-wait"],
    component: WaitingArea,
    available: []
  }]
};
