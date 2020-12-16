import Dapps from 'src/dapps/omoli/views/pages/Dapps.svelte'
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { RunProcess } from 'src/libs/o-events/runProcess';
import { initializeApp } from '../safe/processes/initializeApp/initializeApp';
import { PageManifest } from "../../libs/o-os/interfaces/pageManifest";

export const omoli: PageManifest = {
  component: Dapps,
  conditions: [
    (detail) => {
      console.log("routeGuard.detail:", detail);
      return window.o.fission !== undefined
    }
  ],
  userData: {
    dapp: "omoli",
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
}
