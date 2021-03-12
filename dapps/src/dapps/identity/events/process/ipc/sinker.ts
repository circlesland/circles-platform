import {OmoEvent} from "omo-events/dist/omoEvent";

export interface Sinker extends OmoEvent {
  type: "process.ipc.sinker",
  wrappedEvent: OmoEvent,
  levels: number, // How many levels the event already sunk
  tag: string // Can be used to identify the event
  backTrace: string[] // A list of state-ids that the corresponding bubble passed
  trace: string[] // A list of state-ids that the sinker passed
}