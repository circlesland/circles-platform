import {Bubble} from "../events/process/ipc/bubble";
import {actions} from "xstate";

const {sendParent} = actions;

export const ipcBubble = (id:string) => {
  return {
    "process.ipc.bubble": {
      actions: sendParent((context, event) => {
        const bubble = <Bubble>event;
        return <Bubble>{
          type: "process.ipc.bubble",
          levels: bubble.levels + 1,
          tag: bubble.tag,
          wrappedEvent: bubble.wrappedEvent,
          trace: bubble.trace?.concat([id]) ?? [id]
        };
      })
    },
  }
}