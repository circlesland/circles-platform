import { OmoEventTypes } from "../eventTypes";
import {Signal} from "./signal";

export class BeginSignal extends Signal
{
    constructor()
    {
        super(<OmoEventTypes>"signal.begin");
    }
}
