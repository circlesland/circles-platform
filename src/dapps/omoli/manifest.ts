import Dapps from 'src/dapps/omoli/views/pages/Dapps.svelte'
import {faBoxes, faCoins} from "@fortawesome/free-solid-svg-icons";
import { RunProcess } from 'src/libs/o-events/runProcess';
import { initializeApp } from '../safe/processes/initializeApp/initializeApp';
import {DappManifest} from "../../libs/o-os/interfaces/dappManifest";

export interface OmoLiState {}
export const omoli : DappManifest<OmoLiState,OmoLiState> = {
  id: "omo.li:1",
  dependencies: [],
  isHidden: true,
  icon: faBoxes,
  title: "Dapps",
  routeParts: ["omoli"],
  tag: Promise.resolve("mockup"),
  isEnabled: true,
  pages: [{
    isDefault: true,
    routeParts: ["dapps"],
    component: Dapps,
    available: [
      (detail) => {
        console.log("routeGuard.detail:", detail);
        return window.o.fission !== undefined
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
        event: () => new RunProcess(initializeApp)
      }]
    }
  }]
};
