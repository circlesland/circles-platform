import { createMachine} from "xstate";
import {strings} from "../data/strings";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {setError} from "omo-process/dist/actions/setError";
import {setProcessResult} from "omo-process/dist/actions/setProcessResult";
import {sendErrorPrompt} from "omo-process/dist/actions/sendPrompt/sendErrorPrompt";
import {sendSuccessPrompt} from "omo-process/dist/actions/sendPrompt/sendSuccessPrompt";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {Offer} from "omo-central/dist/generated";
import {tryGetDappState} from "omo-kernel/dist/kernel";
import {FissionAuthState} from "omo-fission/dist/manifest";
import {transferCirclesService} from "../../safe/services/transferCirclesService";
import {config} from "omo-circles/dist/config";
import {CirclesHub} from "omo-circles/dist/circles/circlesHub";
import {TransferCirclesContext} from "../../safe/processes/circles/transferCircles";
import {findTransitivePathService} from "../../safe/services/findTransitivePathService";
import {sendPrompt} from "omo-process/dist/actions/sendPrompt/sendPrompt";
import Banner from "../../../libs/o-views/atoms/Banner.svelte";
import {ethereumAddress} from "omo-process/dist/artifacts/ethereumAddress";
import {o} from "omo-process/dist/artifacts/o";
import {textLine} from "omo-process/dist/artifacts/textLine";
import BN from "omo-quirks/dist/BN";
import {OmoCentral} from "omo-central/dist/omoCentral";

export interface CheckoutContext extends ProcessContext {
  offer: Offer,
  paymentProof?:{
    tokenOwners:string[],
    sources:string[],
    destinations:string[],
    values:string[]
  },
  data: {
  }
}

/*

[showOffer]
Display the offer
  -Next-> [confirmPayment]
  -Cancel-> [finish]
[confirmPayment]
Display the amount and receiver and a notice that you legally buy the item with the transfer
  -Next-> [lock]
  -Cancel-> [finish]
[lock]
Put a lock on the marketplace item
  -On:Done-> [pay]
  -On:Error-> [errorCantLock]
[pay]
Transfer the circles to the item vendor and keep the receipt
  -On:Done-> [provePayment]
  -On:Error-> [errorCantPay]
[provePayment]
Use the transfer receipt to prove the payment
  -On:Done-> [success]
  -On:Error-> [errorCantProve]
[success]
Display a success message
  -On:Enter-> set the market item to sold (prove it with the receipt)
  -Next-> [finish]
[errorCantLock]
Display an error message and inform the user that the purchase wasn't completed
  -Next-> [finish]
[errorCantPay]
Display an error message and inform the user that the purchase wasn't completed
  -Next-> [finish]
[errorCantProve]
Display an error message and inform the user that the purchase was completed but an error occurred when telling this to the server
  -Next-> [finish]

 */

/**
 * Connect safe
 */
const str = strings.omomarket.processes.createOffer;
const processDefinition = (progressView:any, successView:any, errorView:any) => createMachine<CheckoutContext, OmoEvent>({
  initial: "idle",
  states: {
    idle: {
      on: {
        "process.continue": "showOffer"
      }
    },
    showOffer:{
      entry: <any>sendPrompt((context) => {
        return {
          title: "Product",
          nextButtonTitle: "Next",
          canGoBack: true,
          banner: {
            component: Banner,
            data: {
              text: "Banner text"
            }
          },
          artifacts: {}
        }
      }),
      on: {
        "process.continue": "confirmPayment",
        "process.cancel": "stop"
      }
    },
    confirmPayment:{
      entry: <any>sendPrompt((context:CheckoutContext) => {
        return {
          title: str.titleSummary(),
          nextButtonTitle: "Transfer ⦿",
          canGoBack: true,
          banner: {
            component: Banner,
            data: {
              text: str.bannerSummary()
            }
          },
          artifacts: {
            ...textLine("product", "Product", true, true, context.offer.title),
            ...ethereumAddress("recipient", "Payment recipient", true, false, context.offer.createdBy.circlesAddress),
            ...o("value", "Price", true, undefined, new BN(context.offer.price))
          }
        }
      }),
      on: {
        "process.continue": "lock",
        "process.cancel": "stop"
      }
    },
    lock:{
      invoke: <any>{
        id: 'lock',
        src: async (context:CheckoutContext) => {
          const api = await OmoCentral.instance.subscribeToResult();
          await api.lockOffer({
            offerId: context.offer.id
          });
        },
        onError: {
          actions: setError,
          target: "errorCantLock"
        },
        onDone: {
          actions: setProcessResult(str.successMessage),
          target: "pay"
        }
      }
    },
    pay:{
      invoke: <any>{
        id: 'pay',
        src: async (context:CheckoutContext) => {
          const transferCirclesContext:TransferCirclesContext = <any>{};
          transferCirclesContext.web3 = config.getCurrent().web3();
          transferCirclesContext.circlesHub = new CirclesHub(transferCirclesContext.web3, config.getCurrent().HUB_ADDRESS);
          transferCirclesContext.data = {
            recipient: <any>{
              value: context.offer.createdBy.circlesAddress,
            },
            value: <any>{
               value: context.offer.price
            }
          };

          const path = await findTransitivePathService(transferCirclesContext);
          transferCirclesContext.data.pathToRecipient = <any>{
            value: path
          };

          await transferCirclesService(transferCirclesContext);

          context.paymentProof = {
            destinations: [],
            sources: [],
            tokenOwners: [],
            values: []
          };

          path.transfers.forEach(transfer => {
            context.paymentProof.destinations.push(transfer.to);
            context.paymentProof.sources.push(transfer.from);
            context.paymentProof.tokenOwners.push(transfer.tokenOwner);
            context.paymentProof.values.push(transfer.value);
          });
        },
        onError: {
          actions: setError,
          target: "errorCantPay"
        },
        onDone: {
          actions: setProcessResult(str.successMessage),
          target: "provePayment"
        }
      }
    },
    provePayment:{
      invoke: <any>{
        id: 'provePayment',
        src: async (context:CheckoutContext) => {
          const api = await OmoCentral.instance.subscribeToResult();
          await api.provePayment({
            forOfferId: context.offer.id,
            ...context.paymentProof
          });
        },
        onError: {
          actions: setError,
          target: "errorCantProve"
        },
        onDone: {
          actions: setProcessResult(str.successMessage),
          target: "success"
        }
      }
    },
    success:{
      entry: <any>sendSuccessPrompt(successView),
      on: {
        "process.continue": "stop",
        "process.cancel": "stop"
      }
    },
    errorCantLock:{
      entry: <any>sendErrorPrompt(errorView),
      on: {
        "process.continue": "stop",
        "process.cancel": "stop"
      }
    },
    errorCantPay:{
      entry: <any>sendErrorPrompt(errorView),
      on: {
        "process.continue": "stop",
        "process.cancel": "stop"
      }
    },
    errorCantProve:{
      entry: <any>sendErrorPrompt(errorView),
      on: {
        "process.continue": "stop",
        "process.cancel": "stop"
      }
    },
    stop: {
      type: "final"
    }
  }
});

export const checkout: ProcessDefinition = {
  name: "checkout",
  stateMachine:<any> processDefinition
};
