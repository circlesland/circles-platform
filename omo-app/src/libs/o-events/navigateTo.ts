import { OmoEvent } from "./omoEvent";
import { OmoEventTypes } from "./eventTypes";

export class NavigateTo implements OmoEvent {
  type: OmoEventTypes = "shell.navigateTo";

  readonly route: string;

  constructor(route: string) {
    this.route = route;
  }
}
