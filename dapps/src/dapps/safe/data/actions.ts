import { faCoins, faUserCircle, faPiggyBank, faUserFriends, faHome } from "@fortawesome/free-solid-svg-icons";
import { requestUbi, RequestUbiContext } from "../processes/circles/requestUbi";
import { transferCircles, TransferCirclesContext } from "../processes/circles/transferCircles";
import { setTrust, SetTrustContext } from "../processes/circles/setTrust";
import { sendInviteCredits, SendInviteCreditsContext } from "../processes/omo/sendInviteCredits";
import { QuickAction } from "omo-kernel-interfaces/dist/quickAction";
import { RunProcess } from "omo-process/dist/events/runProcess";
import { tryGetDappState } from "omo-kernel/dist/kernel";
import { OmoSafeState } from "../manifest";
import { config } from "omo-circles/dist/config";
import { deploySafe } from "../processes/safe/deploySafe";
import { GnosisSafeProxyFactory } from "omo-circles/dist/safe/gnosisSafeProxyFactory";
import { CirclesHub } from "omo-circles/dist/circles/circlesHub";
import { push } from "svelte-spa-router";

export const safeDefaultActions: QuickAction[] = [
  {
    type: "route",
    pos: "1",
    mapping: {
      design: {
        icon: faPiggyBank
      },
      data: {
        label: "Transactions"
      }
    },
    route: "#/safe/transactions"
  }, {
    type: "route",
    pos: "2",
    mapping: {
      design: {
        icon: faCoins,
      },
      data: {
        label: "Tokens"
      }
    },
    route: "#/safe/tokens"
  }, {
    type: "route",
    pos: "3",
    mapping: {
      design: {
        icon: faUserFriends,
      },
      data: {
        label: "Friends",
      }
    },
    route: "#/safe/friends"
  }, {
    type: "route",
    pos: "4",
    mapping: {
      design: {
        icon: faUserCircle,
      },
      data: {
        label: "Home",
      }
    },
    route: "#/omoli/dapps"
  }
];

export const safeOverflowActions = [
  {
    type: "trigger",
    pos: "overflow",
    mapping: {
      design: {
        icon: faCoins
      },
      data: {
        label: "Harvest new basic income"
      }
    },
    event: () => new RunProcess<RequestUbiContext>(requestUbi, async ctx => {
      ctx.safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
      ctx.web3 = config.getCurrent().web3();
      return ctx;
    })
  },
  {
    type: "trigger",
    pos: "overflow",
    mapping: {
      design: {
        icon: faCoins
      },
      data: {
        label: "Send xDai"
      }
    },
    event: () => new RunProcess<SendInviteCreditsContext>(sendInviteCredits, async processContext => {
      processContext.web3 = config.getCurrent().web3();
      return processContext;
    })
  },
  {
    type: "trigger",
    pos: "overflow",
    mapping: {
      design: {
        icon: faCoins
      },
      data: {
        label: "Send Circles"
      }
    },
    event: () => new RunProcess<TransferCirclesContext>(transferCircles, async processContext => {
      processContext.web3 = config.getCurrent().web3();
      processContext.circlesHub = new CirclesHub(processContext.web3, config.getCurrent().HUB_ADDRESS);
      return processContext;
    })
  },
  {
    type: "trigger",
    pos: "overflow",
    mapping: {
      design: {
        icon: faCoins,
      },
      data: {
        label: "Add friend",
      }
    },
    event: () => new RunProcess(setTrust, async (context: SetTrustContext) => {
      context.web3 = config.getCurrent().web3();
      context.circlesHub = new CirclesHub(context.web3, config.getCurrent().HUB_ADDRESS);
      return context;
    })
  },
];
