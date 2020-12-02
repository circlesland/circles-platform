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
import {JumpstartContext} from "../processes/jumpstart/jumpstart";

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
      jumpstart: {
        successMessage: (context: JumpstartContext) => `You successfully transferred 1 invite credit to ${context.data.recipient.value}. Please tell the recipient to reload the page.`,
        errorMessage: (context: JumpstartContext) => `The jumpstart process failed: ${context.result.error}`,
        titleProgress: () => "sending ..",
        titleSummary: () => "Confirm",
        bannerSummary: () => "Please check the recipient address and click 'Use 1 invite credit' to get this person up and running.",
        titleRecipient: () => "Invite",
        titleValue: () => "invite credits",
        bannerIntro: () => "0x123.. sent you a jumpstart request. Every transaction on the distributed computer costs a little fee. Send 1 invite credit to allow 0x123 to pay for all transaction fees that are required to join circles.",
        titleIntro: () => "Jumpstart someone"
      },
      requestUbi: {
        titleProgress: () => "harvesting ..",
        "successMessage": (context: ProcessContext) => `UBI successfully received`,
        "errorMessage": (context: ProcessContext) => `Error during UBI request. (Probably not sufficient xDai)`
      },
      /*
       transferCircles: {
           "successMessage": (context: TransferCirclesContext) => `Circles successfully transferred`,
           "errorMessage": (context: TransferCirclesContext) => `Circles transfer failed`
       },
       */
      transferCircles: {
        titleRecipient()
        {
          return "";
        },
        bannerRecipient()
        {

        },
        titleValue()
        {
          return "";
        },
        bannerValue()
        {

        },
        titleSummary()
        {
          return "";
        },
        bannerSummary()
        {

        },
        titleProgress()
        {
          return "";
        },
        successMessage()
        {
          return "";
        }
      },
      createSafe: {
        titleSafeAddress: () => "Safe",
        bannerSafeAddress: () => "Please enter your safe address",
        buttonSafeAddress: () => "Save",
        titleSeedPhrase: () => "Seedphrase",
        titleProgress: () => "connecting ...",
        bannerSeedPhrase: () => "Please enter your seed phrase",
        successMessage: (context: ConnectSafeContext) => `The safe is now connected.`,
        errorMessage: (context: ConnectSafeContext) => `Couldn't connect the safe.`,
        titleInitializing: () => "Generating a new key ..",
        titleGenerateFundLink: () => "Get initial funding",
        buttonGenerateFundLink: () => "Close",
        bannerGenerateFundLink: () => "Send this link to a friend to get started",
        progressCreateSafe: () => "Creating your safe",
        successCreateSafe: () => "Your new safe was successfully created",
        choiceConnectSafe()
        {
          return "Connect circles";
        },
        choiceCreateSafe()
        {
          return "Create new";
        },
        bannerConnectOrCreateSafe()
        {
          return "Do you want to connect an existing circles account?";
        },
        titleConnectOrCreateSafe()
        {
          return "Existing account?";
        },
        progressHubSignup()
        {
          return "Registering your account at the circles hub";
        },
        successHubSignup()
        {
          return "Successfully registered at the circles hub"
        },
        progressFundSafe()
        {
          return "Sending some xDai to the safe .."
        },
        successFundSafe()
        {
          return "Sent some xDai to the safe."
        }
      }
    }
  }
}
