import { OmoEventTypes } from "../eventTypes";
import {Signal} from "./signal";

export class ProgressSignal extends Signal
{
    readonly key: string;

    message:string;
    percent:number;
    dummy:any;

    constructor(key:string, message: string, percent: number, dummy?:any)
    {
        super(<OmoEventTypes>"signal.progress", key);
        this.key = key;
        this.message = message;
        this.percent = percent;
        this.dummy = dummy;
    }
}
