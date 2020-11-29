import {ActionBarAction} from "./routes";

export interface PageManifest {
  component:any;
  conditions?:any[];
  userData: {
    dapp: "odentity"|"omo"|"safe"|"website";
    showActionBar?:boolean;
    actions:ActionBarAction[]
  }
}
