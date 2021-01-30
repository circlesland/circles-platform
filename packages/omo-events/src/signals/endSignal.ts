import { OmoEventTypes } from "../eventTypes";
import {Signal} from "./signal";

export class EndSignal extends Signal
{
    constructor()
    {
        super(<OmoEventTypes>"signal.end");
    }
}
