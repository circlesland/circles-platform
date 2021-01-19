import {Signal} from "omo-events/dist/signal";

/**
 * Can be used with a BehaviorSubject to propagate state changes trough multiple dapps.
 */
export interface StatePropagation<TContent>
{
  signal:Signal,
  payload?:TContent
}
