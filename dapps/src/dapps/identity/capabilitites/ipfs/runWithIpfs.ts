import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {actions, createMachine} from "xstate";
import {IpfsNode} from "omo-indexes/dist/ipfsNode";
import * as IPFS from "ipfs";
const {escalate} = actions;

export interface RunWithIpfsContext extends ProcessContext {
  func:(api:IPFS.IPFS) => Promise<any>
}

const processDefinition = (progressView: any, successView: any, errorView: any) => {
  return createMachine<RunWithIpfsContext, OmoEvent & { data?: any }>({
    id: "runWithIpfs",
    initial: "run",
    states: {
      run: {
        entry: () => console.log("runWithIpfs: run"),
        invoke: {
          src: async (context) => {
            return await IpfsNode.runWithIPFS(async ipfs => {
              return await context.func(ipfs);
            });
          },
          onDone: "success",
          onError: "error"
        }
      },
      error: {
        type: 'final',
        entry: [
          () => console.log("runWithIpfs: error"),
          escalate((context, event:OmoEvent&{data:Error}) => event.data),
        ]
      },
      success: {
        entry: () => console.log("runWithIpfs: success"),
        type: 'final',
        data: (context, event : OmoEvent & { data: any }) => {
          console.log("runWithIpfs.success. done data is: ", event.data);
          return event.data
        }
      }
    }
  });
}

/**
 * Run a function that requires the user's fission FileSystem as argument,
 */
export const runWithIpfs: ProcessDefinition<(ipfs:IPFS.IPFS) => Promise<any>, any> = {
  name: "runWithIpfs",
  stateMachine: <any>processDefinition
};