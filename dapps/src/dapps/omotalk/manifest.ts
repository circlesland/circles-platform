import {
  faCoins,
  faComments,
  faEnvelopeOpenText
} from "@fortawesome/free-solid-svg-icons";
import {DappManifest} from "omo-kernel-interfaces/dist/dappManifest";
import Chat from "./pages/Chat.svelte";
import {tryGetDappState} from "omo-kernel/dist/kernel";
import {FissionAuthState} from "omo-fission/dist/manifest";
import {QuickAction} from "omo-kernel-interfaces/dist/quickAction";
import {RunProcess} from "omo-process/dist/events/runProcess";
import {sendMessage, SendMessageContext} from "./processes/sendMessage";
import {OmoCentral} from "omo-central/dist/omoCentral";

export interface OmoTalkState {
}

export const deafultActions: QuickAction[] = [
  {
    type: "route",
    pos: "1",
    mapping: {
      design: {
        icon: faEnvelopeOpenText
      },
      data: {
        label: "Chat"
      }
    },
    route: "#/omotalk/chat"
  }
];

export const overflowActions: QuickAction[] = [{
  type: "trigger",
  pos: "overflow",
  mapping: {
    design: {
      icon: faCoins,
    },
    data: {
      label: "Send new message",
    }
  },
  event: () => new RunProcess<SendMessageContext>(sendMessage, async ctx => {
      ctx.omoCentral = await OmoCentral.instance.subscribeToResult();
      ctx.namespace = "omo.talk"
      ctx.topic = "chat";
      return ctx;
  })
}]

const chat = {
  isDefault: true,
  routeParts: ["chat"],
  component: Chat,
  available: [
    (detail) => {
      window.o.logger.log("routeGuard.detail:", detail);
      const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
      return fissionAuthState.state.username !== undefined
    }
  ],
  userData: {
    showActionBar: true,
    actions: <QuickAction[]>[
      ...deafultActions,
      ...overflowActions
    ]
  }
};

export const omotalk: DappManifest<OmoTalkState> = {
  dappId: "omo.talk:1",
  isSingleton: true,
  dependencies: ["omo.safe:1"], // TODO: Needs access to the contact list which is currently in the safe
  isHidden: false,
  icon: faComments,
  title: "Talk",
  routeParts: ["omotalk"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  pages: [chat]
};
