import { OmoEventTypes } from "../eventTypes";
import {Signal} from "./signal";

export class ProgressSignal extends Signal
{
    message:string;
    percent:number;
    dummy:any;

    constructor(message: string, percent: number, dummy?:any)
    {
        super(<OmoEventTypes>"signal.progress");
        this.message = message;
        this.percent = percent;
        this.dummy = dummy;
    }
}
