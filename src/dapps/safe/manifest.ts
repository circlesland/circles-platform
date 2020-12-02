import AnswerInviteRequest from "./views/pages/AnswerInviteRequest.svelte"
import Transactions from "./views/pages/Transactions.svelte"
import Friends from "./views/pages/Friends.svelte"
import Tokens from "./views/pages/Tokens.svelte"
import {safeDefaultActions, safeOverflowActions} from "./data/actions"
import {PageManifest} from "../../libs/o-os/interfaces/pageManifest";
import {QuickAction} from "../../libs/o-os/types/quickAction";
import {RunProcess} from "../../libs/o-events/runProcess";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {sendInviteCredits, SendInviteCreditsContext} from "./processes/transferXDai/sendInviteCredits";
import {ProcessArtifact} from "../../libs/o-processes/interfaces/processArtifact";
import {CloseModal} from "../../libs/o-events/closeModal";
import {push} from "svelte-spa-router";

export const answerInviteRequest: PageManifest = {
  component: AnswerInviteRequest,
  conditions: [
    (detail) => {
      console.log("Starting answer invite process ..", detail);
      return true;
    }
  ],
  userData: {
    showActionBar: true,
    dapp: "safe",
    actions: <QuickAction[]>[
      ...safeDefaultActions,
      ...[{
          type: "trigger",
          pos: "overflow",
          mapping: {
            design: {
              icon: faCheck
            },
            data: {
              label: "Jumpstart " + "0x1234..."
            }
          },
          event: () => new RunProcess(sendInviteCredits, async (context:SendInviteCreditsContext) => {
            context.data.recipient = <ProcessArtifact>{
              key: "recipient",
              value: "", // TODO: pre-populate all fields
              isReadonly: true
            };
            return context;
          })
        },{
        type: "trigger",
        pos: "overflow",
        mapping: {
          design: {
            icon: faTimes
          },
          data: {
            label: "Cancel"
          }
        },
        event: () => {push("#/safe/transactions"); window.o.publishEvent(new CloseModal())}
      }]
    ]
  }
}

export const transactions: PageManifest = {
  component: Transactions,
  conditions: [
    (detail) => {
      console.log("routeGuard.detail:", detail);
      return window.o.fission !== undefined
    }
  ],
  userData: {
    showActionBar: true,
    dapp: "safe",
    actions: <QuickAction[]>[
      ...safeDefaultActions,
      ...safeOverflowActions
    ]
  }
}

export const friends: PageManifest = {
  component: Friends,
  conditions: [
    (detail) => {
      console.log("routeGuard.detail:", detail);
      return window.o.fission !== undefined
    }
  ],
  userData: {
    showActionBar: true,
    dapp: "safe",
    actions: <QuickAction[]>[
      ...safeDefaultActions,
      ...safeOverflowActions
    ]
  }
}

export const tokens: PageManifest = {
  component: Tokens,
  conditions: [
    (detail) => {
      console.log("routeGuard.detail:", detail);
      return window.o.fission !== undefined
    }
  ],
  userData: {
    showActionBar: true,
    dapp: "safe",
    actions: <QuickAction[]>[
      ...safeDefaultActions,
      ...safeOverflowActions
    ]
  }
}
