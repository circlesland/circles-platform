import {Sinker} from "../events/process/ipc/sinker";
import {actions} from "xstate";
const {send} = actions;

export const ipcSinker = (id:string) => {
  return {
    "process.ipc.sinker": [ {
      // Unwrap and send
      cond: (context, event) => {
        const sinker = <Sinker>event;
        // TODO: Automatically unwrap the sinker
        return sinker.levels == 1;
      },
      actions: send((context, event) => {
        const sinker = <Sinker>event;
        return sinker.wrappedEvent;
      }, {
        to: (context, event:Sinker) => event.backTrace.pop()
      })
    }, {
      // Let it continue to sink
      cond: (context, event) => {
        const sinker = <Sinker>event;
        return sinker.levels > 0
          && (!sinker.trace?.length || sinker.trace[sinker.trace.length - 1] != id)
      },
      actions: send((context, event) => {
        const sinker = <Sinker>event;
        const newSinker = <Sinker>{
          type: "process.ipc.sinker",
          levels: sinker.levels - 1,
          tag: sinker.tag,
          wrappedEvent: sinker.wrappedEvent,
          trace: sinker.trace?.concat([id]) ?? [id],
          backTrace: sinker.backTrace
        };
        return newSinker;
      }, {
        to: (context, event:Sinker) => {
          const to =  event.backTrace.pop();
          return to;
        }
      })
    }]
  }
}