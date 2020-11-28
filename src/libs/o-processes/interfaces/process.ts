import {Observable} from "rxjs";
import {ProcessEvent} from "./processEvent";
import {OmoEvent} from "../../o-events/omoEvent";

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
  events: Observable<ProcessEvent>;
  /**
   * The process' in-stream.
   */
  sendEvent(event: OmoEvent);
}
