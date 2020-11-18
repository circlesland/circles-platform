import {OmoEvent} from "./omoEvent";

export class ShowModal implements OmoEvent {
    type: "showModal";

    readonly component:any;

    constructor(component:any)
    {
        this.component = component;
    }
}
