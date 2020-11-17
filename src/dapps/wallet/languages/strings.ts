import {SetTrustContext} from "../processes/setTrust/setTrust";
import {ConnectSafeContext} from "../processes/connectSafe/connectSafe";
import {JumpstartContext} from "../processes/jumpstart/jumpstart";
import {ProcessContext} from "../../../libs/o-processes/processContext";
import {TransferCirclesContext} from "../processes/transferCircles/transferCircles";
import {TransferXDaiContext} from "../processes/transferXDai/transferXDai";

export const strings = {
    wallet: {
        processes: {
            setTrust: {
                "successMessage": (context: SetTrustContext) => context.setTrust.trustLimit.data > 0
                    ? `Successfully trusted ${context.setTrust.trustReceiver.data}`
                    : `Successfully untrusted ${context.setTrust.trustReceiver.data}`,
                "errorMessage": (context: SetTrustContext) => context.setTrust.trustLimit.data > 0
                    ? `An error occurred while trusting ${context.setTrust.trustReceiver.data}.`
                    : `An error occurred while untrusting ${context.setTrust.trustReceiver.data}.`,
                "trustConfirmation": (context: SetTrustContext) => `Click 'Next' to add ${context.setTrust.trustReceiver.data} to your list of trusted persons.`,
                "untrustConfirmation": (context: SetTrustContext) => `Click 'Next' to remove ${context.setTrust.trustReceiver.data} from your list of trusted persons.`,
                "setTrustProgress":  (context: SetTrustContext) => context.setTrust.trustLimit.data > 0 ? "Trusting .." : "Untrusting ..",
                "alreadyTrustedError": (context: SetTrustContext) => `You are already trusting ${context.setTrust.trustReceiver.data}.`
            },
            connectSafe: {
                "successMessage": (context: ConnectSafeContext) => `The safe is now connected.`,
                "errorMessage": (context: ConnectSafeContext) => `Couldn't connect the safe.`
            },
            jumpstart: {
                "successMessage": (context: JumpstartContext) => `Successfully jumpstarted ${context.jumpstart.recipient.data}.`,
                "errorMessage": (context: JumpstartContext) => `Couldn't jumpstart ${context.jumpstart.recipient.data}`
            },
            requestUbi: {
                "successMessage": (context: ProcessContext) => `UBI successfully requested`,
                "errorMessage": (context: ProcessContext) => `Error during UBI request`
            },
            transferCircles: {
                "successMessage": (context: TransferCirclesContext) => `Circles successfully transferred`,
                "errorMessage": (context: TransferCirclesContext) => `Circles transfer failed`
            },
            transferXDai: {
                "successMessage":(context: TransferXDaiContext) => `xDai successfully transferred`,
                "errorMessage":(context: TransferXDaiContext) => `xDai transfer failed`
            }
        }
    }
}
