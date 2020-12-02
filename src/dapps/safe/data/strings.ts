import { InitializeAppContext } from "../processes/initializeApp/initializeApp";
import { SetTrustContext } from "../processes/setTrust/setTrust";
import { SendInviteCreditsContext } from "../processes/transferXDai/sendInviteCredits";
import { ProcessContext } from "../../../libs/o-processes/interfaces/processContext";
malimport { JumpstartContext } from "../processes/jumpstart/jumpstart";
import { getEnvironment } from "../../../libs/o-os/o";

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
      sendInviteCredits: {
        "successMessage": (context: SendInviteCreditsContext) => `xDai successfully transferred`,
        "errorMessage": (context: SendInviteCreditsContext) => `xDai transfer failed`,
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
        titleIntro: () => "Jumpstart",
        introHeader: (context: JumpstartContext) => `<span class="text-3xl">${context.data.recipient.value.substring(0, 8)}</span>`,
        introSubHeader: (context: JumpstartContext) => `is asking you to empower his/her life`,
        introBody: (context: JumpstartContext) => `You can use your invite credits to invite and unlock the universal basic income account of ${context.data.recipient.value}. You still have
      ${Math.floor(parseFloat(context.environment.eth.web3.utils.fromWei(context.environment.me.mySafeXDaiBalance?.toString() ?? "", 'ether')) * 10)}
      invite credits (${parseFloat(context.environment.eth.web3.utils.fromWei(context.environment.me.mySafeXDaiBalance?.toString() ?? "", 'ether')).toFixed(2)}
      xDai) left.<br />
      To refill your invite credits please send xDai to your safe
      ${context.environment.me.mySafe?.address ?? ""} or ask in the
      <a href="https://discord.gg/KgbBdAck8X" style="color: #0D49A3">omo
        community</a>
      for help. (One invite credit = 0.10 xDai)`
      },
      requestUbi: {
        titleProgress: () => "harvesting ..",
        "successMessage": (context: ProcessContext) => `UBI successfully received`,
        "errorMessage": (context: ProcessContext) => `Error during UBI request. (Probably not sufficient xDai)`
      },
      transferCircles: {
        "successMessage": (context: SendInviteCreditsContext) => `Circles successfully transferred`,
        "errorMessage": (context: SendInviteCreditsContext) => `Circles transfer failed (check trust)`,
        titleRecipient: () => "Recipient",
        bannerRecipient: () => "Please enter the recipients address",
        titleValue: () => "Amount",
        bannerValue: () => "Please enter the amount (in Circles)",
        titleProgress: () => "Sending ..",
        titleSummary: () => "Confirm",
        bannerSummary: () => "Please check the transaction details and click 'Transfer Circles' to confirm the transaction"
      },
      initializeApp: {
        titleSafeAddress: () => "Safe",
        bannerSafeAddress: () => "Please enter your safe address",
        buttonSafeAddress: () => "Save",
        titleSeedPhrase: () => "Seedphrase",
        titleProgress: () => "connecting ...",
        bannerSeedPhrase: () => "Please enter your seed phrase",
        successMessage: (context: InitializeAppContext) => `The safe is now connected.`,
        errorMessage: (context: InitializeAppContext) => `Couldn't connect the safe.`,
        titleInitializing: () => "Generating a new key ..",
        titleGenerateFundLink: () => "Get initial funding",
        buttonGenerateFundLink: () => "Close",
        bannerGenerateFundLink: async () => {
          const env = await getEnvironment();
          return "Send this link to a friend to get started or send 0.1 xDai to '" + env.me.myAddress + "'"
        },
        progressDeploySafe: () => "Creating your safe",
        successDeploySafe: () => "Your new safe was successfully created",
        choiceConnectSafe: () => "Connect circles",
        choiceCreateSafe: () => "Create new",
        bannerConnectOrCreateSafe: () => "Do you want to connect an existing circles account?",
        titleConnectOrCreateSafe: () => "Existing account?",
        progressHubSignup: () => "Registering your account at the circles hub",
        successHubSignup: () => "Successfully registered at the circles hub",
        progressFundSafe: () => "Sending some xDai to the safe ..",
        successFundSafe: () => "Sent some xDai to the safe.",
        successCreatePrivateKey: () => "Private key created.",
        progressCreatePrivateKey: () => "Creating private key ..",
        fundLinkHeader: (context: InitializeAppContext) => `Welcome ${context.environment.me.myDisplayName()}`,
        fundLinkSubHeader: () => `to unlock your account send this invite link to a friend with invite credits`,
        fundLinkBody(context: InitializeAppContext) {
          return `To unlock yourself send 0.10 xDai to your account address (${context.environment.me.myAddress}) or ask in the
      <a href="https://discord.gg/KgbBdAck8X" style="color: #0D49A3">omo
        community</a>
      for help. (One invite credit = 0.10 xDai)`
        }
      }
    }
  }
}
