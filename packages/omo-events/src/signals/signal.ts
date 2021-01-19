import { OmoEvent } from "../omoEvent";
import { OmoEventTypes } from "../eventTypes";

export abstract class Signal implements OmoEvent
{
    readonly type: OmoEventTypes;
    readonly timestamp: number = Date.now();

    constructor(type:OmoEventTypes)
    {
        this.type = type;
    }
}
