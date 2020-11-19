import {OmoEvent} from "./omoEvent";
import {OmoEventTypes} from "./eventTypes";

export class ShowModal implements OmoEvent {
    type: OmoEventTypes = "showModal";

    readonly component:any;

    constructor(component:any)
    {
        this.component = component;
    }
}
