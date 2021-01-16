import { OmoEvent } from "../omoEvent";
import { OmoEventTypes } from "../eventTypes";

export abstract class Signal implements OmoEvent
{
    readonly key: string;
    readonly type: OmoEventTypes;
    readonly timestamp: number = Date.now();

    constructor(type:OmoEventTypes, key:string)
    {
        this.key = key;
        this.type = type;
    }
}
