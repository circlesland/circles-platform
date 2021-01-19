import { OmoEventTypes } from "../eventTypes";
import {Signal} from "./signal";

export class ReadySignal extends Signal
{
    constructor()
    {
        super(<OmoEventTypes>"signal.ready");
    }
}
