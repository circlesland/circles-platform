import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {sendPrompt} from "omo-process/dist/actions/sendPrompt/sendPrompt";
import {createMachine, actions} from "xstate";
import {ipcSinker} from "../../patterns/ipcSinker";
import {Bubble} from "../../events/process/ipc/bubble";
const {send} = actions;

export interface ShellProcessContext extends ProcessContext {
  childProcessId: string;
  childProcessDefinition:ProcessDefinition<any,any>
  childContext?:ProcessContext;
}

/**
 * Wraps a process and provides shell services to it.
 */
const processDefinition = (progressView: any, successView: any, errorView: any) => {
  return createMachine<ShellProcessContext, OmoEvent & { data?: any }>({
    id: "shellProcess",
    initial: "idle",
    states: {
      idle: {
        on: {"*":"run"}
      },
      run: {
        entry: (context) => console.log(`shellProcess: run - Name: ${context.childProcessDefinition.name}`),
        invoke: {
          id: "childProcess",
          src: context => {
            const sm = context.childProcessDefinition.stateMachine(progressView, successView, errorView);
            return <any>sm; // TODO: Fix 'any'
          },
          data: (context) => {
            const newChildContext = {};
            if (context.childContext) {
              Object.keys(context.childContext).forEach(key => {
                newChildContext[key] = context.childContext[key];
              });
            }
            return newChildContext
          },
          onError: "showError",
          onDone: [{
            cond: (context, event: { type:string, data: any }) => !event.data,
            target: "showError"
          }, {
            target: "finished"
          }]
        },

        on: {
          //
          // Global event handlers
          //
          "process.cancel": "cancelled",

          //
          // IPC events
          //
          ...ipcSinker("childProcess"),
          "process.ipc.bubble": {
            cond: (context, event:Bubble) => event.trace[event.trace.length - 1] !== "childProcess",
            actions: send((context, event) => {
              const bubble = <Bubble>event;
              return <Bubble>{
                type: "process.ipc.bubble",
                levels: bubble.levels + 1,
                tag: bubble.tag,
                wrappedEvent: bubble.wrappedEvent,
                trace: bubble.trace.concat(["childProcess"])
              };
            })
          }
        }
      },
      showError: {
        entry: <any>sendPrompt((context: ShellProcessContext, event: OmoEvent & { data: any }) => {
          return {
            canGoBack: false,
            title: `"${context.childProcessDefinition.name}" crashed`,
            nextButtonTitle: "Retry",
            banner: {
              component: errorView,
              data: {
                error: event.data
              }
            },
            artifacts: {}
          }
        }),
        on: {
          "process.continue": {
            target: "run",
            actions: send("process.continue")
          },
          "process.cancel": {target: "error"}
        }
      },
      cancelled: {
        id: "cancelled",
        entry: () => console.log("shellProcess: cancelled"),
        type: 'final',
        data: () => false
      },
      finished: {
        entry: () => console.log("shellProcess: finished"),
        type: 'final',
        data: () => true
      },
      error: {
        entry: () => console.log("shellProcess: error"),
        type: 'final',
        data: () => false
      }
    }
  });
}
export const shellProcess: ProcessDefinition<{
  childProcessDefinition:ProcessDefinition<any,any>
  childContext?:ProcessContext;
}, any> = {
  name: "shellProcess",
  stateMachine: <any>processDefinition
};