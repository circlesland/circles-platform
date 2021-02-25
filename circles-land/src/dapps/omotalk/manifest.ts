import {
  faArrowUp, faCoins,
  faComments,
  faEnvelopeOpenText, faPen,
} from "@fortawesome/free-solid-svg-icons";
import {DappManifest} from "omo-kernel-interfaces/dist/dappManifest";
import Inbox from "./pages/Inbox.svelte";
import Outbox from "./pages/Outbox.svelte";
import Drafts from "./pages/Drafts.svelte";
import {tryGetDappState} from "omo-kernel/dist/kernel";
import {FissionAuthState} from "omo-fission/dist/manifest";
import {QuickAction} from "omo-kernel-interfaces/dist/quickAction";
import {RunProcess} from "omo-process/dist/events/runProcess";
import {sendMessage, SendMessageContext} from "./processes/sendMessage";

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
        label: "Inbox"
      }
    },
    route: "#/omotalk/inbox"
  }, {
    type: "route",
    pos: "2",
    mapping: {
      design: {
        icon: faArrowUp,
      },
      data: {
        label: "Sent"
      }
    },
    route: "#/omotalk/outbox"
  }, {
    type: "route",
    pos: "3",
    mapping: {
      design: {
        icon: faPen,
      },
      data: {
        label: "Drafts"
      }
    },
    route: "#/omotalk/drafts"
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
    return new Promise<SendMessageContext>((resolve => {
      const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
      fissionAuthState.fissionState.omoCentralClientSubject.subscribe(async api => {
        ctx.omoCentral = api;
        ctx.namespace = "omo.talk"
        ctx.topic = "chat";
        resolve(ctx);
      });
    }));
  })
}];

const inbox = {
  isDefault: true,
  routeParts: ["inbox"],
  component: Inbox,
  available: [
    (detail) => {
      window.o.logger.log("routeGuard.detail:", detail);
      const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
      return fissionAuthState.fission !== undefined
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

const outbox = {
  isDefault: true,
  routeParts: ["outbox"],
  component: Outbox,
  available: [
    (detail) => {
      window.o.logger.log("routeGuard.detail:", detail);
      const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
      return fissionAuthState.fission !== undefined
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

const drafts = {
  isDefault: true,
  routeParts: ["drafts"],
  component: Drafts,
  available: [
    (detail) => {
      window.o.logger.log("routeGuard.detail:", detail);
      const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
      return fissionAuthState.fission !== undefined
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
  pages: [inbox, outbox, drafts]
};
