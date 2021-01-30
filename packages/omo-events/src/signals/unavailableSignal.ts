import { OmoEventTypes } from "../eventTypes";
import {Signal} from "./signal";

export class UnavailableSignal extends Signal
{
    constructor()
    {
        super(<OmoEventTypes>"signal.unavailable");
    }
}
