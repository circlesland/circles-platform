import { ProcessEvent } from "./processEvent";
import { OmoEvent } from "omo-events/dist/omoEvent";
import {OmoObservable} from "omo-quirks/dist/OmoObservable";

/**
 * Provides a connection to a running process.
 * The process provides its events via the 'events'-property
 * and you can send events to the process via 'sendEvents()'.
 *
 * The events from the process have additional properties
 * that indicate the current state of the process.
 */
export interface Process {
  /**
   * A unique process id.
   */
  id: number;
  /**
   * The process' out-stream.
   */
  events: OmoObservable<ProcessEvent>;
  /**
   * The process' in-stream.
   */
  sendEvent(event: OmoEvent) : void;
}
