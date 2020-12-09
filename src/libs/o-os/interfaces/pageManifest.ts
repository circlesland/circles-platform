import { QuickAction } from "../types/quickAction";

export interface PageManifest {
  component: any;
  conditions?: any[];
  userData: {
    dapp: "omosapien" | "omoli" | "omomarket" | "omofunding" | "safe" | "website";
    showActionBar?: boolean;
    actions: QuickAction[]
  }
}
