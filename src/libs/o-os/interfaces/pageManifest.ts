import {QuickAction} from "../types/quickAction";

export interface PageManifest {
  component:any;
  conditions?:any[];
  userData: {
    dapp: "odentity"|"omo"|"safe"|"website";
    showActionBar?:boolean;
    actions:QuickAction[]
  }
}
