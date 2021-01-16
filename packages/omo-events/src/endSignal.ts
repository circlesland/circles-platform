import {OmoEventTypes} from "../dist/eventTypes";
import {Signal} from "./signal";

export class EndSignal extends Signal
{
    readonly key: string;

    constructor(key:string)
    {
        super(<OmoEventTypes>"signal.end", key);
        this.key = key;
    }
}
