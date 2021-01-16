import { OmoEvent } from "./omoEvent";
import { OmoEventTypes } from "./eventTypes";

export class ShowNotification implements OmoEvent {
  type: OmoEventTypes = "shell.showNotification";

  readonly component: any;
  readonly mapping: any;

  constructor(component: any, mapping: any) {
    this.component = component;
    this.mapping = mapping;
  }
}
