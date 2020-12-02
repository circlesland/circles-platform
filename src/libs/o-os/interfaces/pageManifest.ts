import { QuickAction } from "../types/quickAction";

export interface PageManifest {
  component: any;
  conditions?: any[];
  userData: {
    dapp: "omosapien" | "omoli" | "safe" | "website";
    showActionBar?: boolean;
    actions: QuickAction[]
  }
}
