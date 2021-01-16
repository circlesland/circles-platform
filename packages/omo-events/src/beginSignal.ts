import {OmoEventTypes} from "../dist/eventTypes";
import {Signal} from "./signal";

export class BeginSignal extends Signal
{
    readonly key: string;

    constructor(key:string)
    {
        super(<OmoEventTypes>"signal.begin", key);
        this.key = key;
    }
}
