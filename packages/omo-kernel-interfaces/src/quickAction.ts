import {OmoEvent} from "omo-events/dist/omoEvent";

export type QuickAction = {
  type: "route" | "trigger",
  pos: "1" | "2" | "3" | "4" | "overflow",
  mapping: {
    design: {
      icon: any
    },
    data: {
      label: string
    }
  }
  event?: () => OmoEvent,
  route?: string
}
