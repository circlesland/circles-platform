/*import { SetTrustContext } from "../processes/setTrust/setTrust";
import { JumpstartContext } from "../processes/jumpstart/jumpstart";
import { ProcessContext } from "../../../libs/o-processes/processContext";
import { TransferCirclesContext } from "../processes/transferCircles/transferCircles";
import { TransferXDaiContext } from "../processes/transferXDai/transferXDai";
*/import { ConnectSafeContext } from "../processes/connectSafe/connectSafe";
import {SetTrustContext} from "../processes/setTrust/setTrust";

export const strings = {
    safe: {
        processes: {
            setTrust: {
              "titleTrustReceiver": () => "Trust receiver",
              "bannerTrustRecipient": () => "Please enter the address of the trust receiver",
              "titleWorking": () => "Working ..",
                "successMessage": (context: SetTrustContext) => `Successfully trusted ${context.data.trustReceiver.value.slice(0, 8)}`,
                "errorMessage": (context: SetTrustContext) => `An error occurred while trusting ${context.data.trustReceiver.value.slice(0, 8)}.`,
                "alreadyTrustedError": (context: SetTrustContext) => `You are already trusting ${context.data.trustReceiver.value.slice(0, 8)}.`
            },
            connectSafe: {
              "titleSafeAddress": () => "Safe address",
              "bannerSafeAddress": () => "Please enter your safe address",
              "titleSeedPhrase": () => "Seedphrase",
              "titleProgress": () => "Working ..",
              "bannerSeedPhrase": () => "Please enter your seed phrase",
              "successMessage": (context: ConnectSafeContext) => `The safe is now connected. (Please close the dialog)`,
              "errorMessage": (context: ConnectSafeContext) => `Couldn't connect the safe.`
            },
           /* jumpstart: {
                "successMessage": (context: JumpstartContext) => `Successfully jumpstarted ${context.jumpstart.recipient.data.slice(0, 8)}.`,
                "errorMessage": (context: JumpstartContext) => `Couldn't jumpstart ${context.jumpstart.recipient.data.slice(0, 8)}`
            },
            requestUbi: {
                "successMessage": (context: ProcessContext) => `UBI successfully requested`,
                "errorMessage": (context: ProcessContext) => `Error during UBI request. (Probably not sufficient xDai)`
            },
            transferCircles: {
                "successMessage": (context: TransferCirclesContext) => `Circles successfully transferred`,
                "errorMessage": (context: TransferCirclesContext) => `Circles transfer failed`
            },
            transferXDai: {
                "successMessage": (context: TransferXDaiContext) => `xDai successfully transferred`,
                "errorMessage": (context: TransferXDaiContext) => `xDai transfer failed`
            }*/
        }
    }
}
