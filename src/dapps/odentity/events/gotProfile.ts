import {OmoEvent} from "../../../libs/o-events/omoEvent";
import {OmoEventTypes} from "../../../libs/o-events/eventTypes";
import {Profile} from "../interfaces/profile";

export class GotProfile implements OmoEvent {
  type: OmoEventTypes = "shell.gotProfile";
  profile:Profile;

  constructor(profile:Profile)
  {
    this.profile = profile;
  }
}
