import Website from 'src/dapps/website/views/pages/Website.svelte'
import Visionpaper from 'src/dapps/website/views/pages/Visionpaper.svelte'
import Privacy from 'src/dapps/website/views/pages/Privacy.svelte'
import TOS from 'src/dapps/website/views/pages/TOS.svelte'
import Attributions from 'src/dapps/website/views/pages/Attributions.svelte'
import {faGlobe} from "@fortawesome/free-solid-svg-icons";
import {DappManifest} from "omo-kernel-interfaces/dist/dappManifest";

const homepage = {
  isDefault: true,
  routeParts: [],
  component: Website,
  userData: {
    showActionBar: false,
    actions: []
  }
};

export interface OmoWebsiteState {}
export const omowebsite : DappManifest<OmoWebsiteState,OmoWebsiteState> = {
  id: "omo.website:1",
  isSingleton: true,
  dependencies: [],
  isHidden: true,
  icon: faGlobe,
  title: "Hompage",
  routeParts: [],
  tag: Promise.resolve(null),
  isEnabled: true,
  pages: [homepage, {
    routeParts: ["privacy"],
    component: Privacy,
    userData: {
      showActionBar: false,
      actions: []
    }
  }, {
    routeParts: ["tos"],
    component: TOS,
    userData: {
      showActionBar: false,
      actions: []
    }
  }, {
    routeParts: ["attributions"],
    component: Attributions,
    userData: {
      showActionBar: false,
      actions: []
    }
  }, {
    routeParts: ["visionpaper"],
    component: Visionpaper,
    userData: {
      showActionBar: false,
      actions: []
    }
  }]
};
