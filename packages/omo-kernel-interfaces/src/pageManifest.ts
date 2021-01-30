import { QuickAction } from "./quickAction";

export interface PageManifest {
  component: any,
  isDefault?:boolean,
  available?: any[],
  routeParts: string[],
  userData?: {
    showActionBar?: boolean,
    actions: QuickAction[]
  }
}
