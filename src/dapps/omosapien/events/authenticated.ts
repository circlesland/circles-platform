import {OmoEvent} from "../../../libs/o-events/omoEvent";
import {OmoEventTypes} from "../../../libs/o-events/eventTypes";
import {AuthSucceeded, Continuation} from "webnative";

export class Authenticated implements OmoEvent {
  type: OmoEventTypes = "shell.authenticated";
  fissionAuth:AuthSucceeded|Continuation;

  constructor(fissionAuth:AuthSucceeded|Continuation)
  {
    this.fissionAuth = fissionAuth;
  }
}
