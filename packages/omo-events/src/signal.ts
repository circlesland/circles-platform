import {OmoEvent} from "../dist/omoEvent";
import {OmoEventTypes} from "../dist/eventTypes";

export abstract class Signal implements OmoEvent
{
    readonly key: string;
    readonly type: OmoEventTypes;

    constructor(type:OmoEventTypes, key:string)
    {
        this.key = key;
        this.type = type;
    }
}
