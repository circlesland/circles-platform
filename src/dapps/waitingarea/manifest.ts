import WaitingArea from "./pages/WaitingArea.svelte";
import {DappManifest} from "../../libs/o-os/interfaces/dappManifest";
import {faHourglass} from "@fortawesome/free-solid-svg-icons";

export interface WaitingAreaState {}
export const waitingarea : DappManifest<WaitingAreaState,WaitingAreaState> = {
  id: "omo.waitingarea:1",
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
