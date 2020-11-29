/*import { SetTrustContext } from "../processes/setTrust/setTrust";
import { JumpstartContext } from "../processes/jumpstart/jumpstart";
import { ProcessContext } from "../../../libs/o-processes/processContext";
import { TransferCirclesContext } from "../processes/transferCircles/transferCircles";
import { TransferXDaiContext } from "../processes/transferXDai/transferXDai";
*/
import { ConnectSafeContext } from "../processes/connectSafe/connectSafe";
import { SetTrustContext } from "../processes/setTrust/setTrust";
import { TransferXDaiContext } from "../processes/transferXDai/transferXDai";
import { ProcessContext } from "../../../libs/o-processes/interfaces/processContext";

export const strings = {
  safe: {
    processes: {
      unTrust: {
        "titleTrustReceiver": () => "Revoke trust",
        "bannerTrustRecipient": () => "Please enter the address of the person you want to revoke trust",
        "titleWorking": () => "revoking trust ..",
        "successMessage": (context: SetTrustContext) => `Successfully untrusted ${context.data.trustReceiver.value.slice(0, 8)}`,
        "errorMessage": (context: SetTrustContext) => `An error occurred while untrusting ${context.data.trustReceiver.value.slice(0, 8)}.`,
      },
      setTrust: {
        "titleTrustReceiver": () => "Trust",
        "bannerTrustRecipient": () => "Please enter the address of the person you want to trust",
        "titleWorking": () => "trusting ..",
        "successMessage": (context: SetTrustContext) => `Successfully trusted ${context.data.trustReceiver.value.slice(0, 8)}`,
        "errorMessage": (context: SetTrustContext) => `An error occurred while trusting ${context.data.trustReceiver.value.slice(0, 8)}.`,
        "alreadyTrustedError": (context: SetTrustContext) => `You are already trusting ${context.data.trustReceiver.value.slice(0, 8)}.`
      },
      connectSafe: {
        "titleSafeAddress": () => "Safe",
        "bannerSafeAddress": () => "Please enter your safe address",
        "buttonSafeAddress": () => "Save",
        "titleSeedPhrase": () => "Seedphrase",
        "titleProgress": () => "connecting ...",
        "bannerSeedPhrase": () => "Please enter your seed phrase",
        "successMessage": (context: ConnectSafeContext) => `The safe is now connected.`,
        "errorMessage": (context: ConnectSafeContext) => `Couldn't connect the safe.`,
      },
      transferXDai: {
        "successMessage": (context: TransferXDaiContext) => `xDai successfully transferred`,
        "errorMessage": (context: TransferXDaiContext) => `xDai transfer failed`,
        titleRecipient: () => "Recipient",
        bannerRecipient: () => "Please enter the recipients address",
        titleValue: () => "Amount",
        bannerValue: () => "Please enter the amount (in xDai)",
        titleProgress: () => "sending ..",
        titleSummary: () => "Confirm",
        bannerSummary: () => "Please check the transaction details and click 'Transfer xDai' to confirm the transaction"
      },
      requestUbi: {
        titleProgress: () => "harvesting ..",
        "successMessage": (context: ProcessContext) => `UBI successfully received`,
        "errorMessage": (context: ProcessContext) => `Error during UBI request. (Probably not sufficient xDai)`
      },
      /* jumpstart: {
           "successMessage": (context: JumpstartContext) => `Successfully jumpstarted ${context.jumpstart.recipient.data.slice(0, 8)}.`,
           "errorMessage": (context: JumpstartContext) => `Couldn't jumpstart ${context.jumpstart.recipient.data.slice(0, 8)}`
       },
       transferCircles: {
           "successMessage": (context: TransferCirclesContext) => `Circles successfully transferred`,
           "errorMessage": (context: TransferCirclesContext) => `Circles transfer failed`
       },
       */
    }
  }
}
