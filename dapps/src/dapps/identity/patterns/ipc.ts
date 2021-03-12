import {ipcSinker} from "./ipcSinker";
import {ipcBubble} from "./ipcBubble";

export const ipc = (id:string) => {
  return {
    ...ipcSinker(id),
    ...ipcBubble(id)
  }
}