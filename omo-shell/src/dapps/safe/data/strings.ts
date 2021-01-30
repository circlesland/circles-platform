import {SetTrustContext} from "../processes/circles/setTrust";
import {JumpstartContext} from "../processes/omo/jumpstart";
import {SendInviteCreditsContext} from "../processes/omo/sendInviteCredits";
import {OmoSafeState} from "../manifest";
import {OmoSapienState} from "../../omosapien/manifest";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {config} from "omo-circles/dist/config";
import {tryGetDappState} from "omo-kernel/dist/kernel";

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
        "successMessage": (context: SendInviteCreditsContext) => `invites successfully transferred`,
        "errorMessage": (context: SendInviteCreditsContext) => `Invite transfer failed`,
        titleRecipient: () => "Recipient",
        bannerRecipient: () => "Please enter the recipients address",
        titleValue: () => "Amount",
        bannerValue: () => "Please enter the amount (in xDai)",
        titleProgress: () => "sending ..",
        titleSummary: () => "Confirm",
        bannerSummary: () => "Please check the transaction details and confirm"
      },
      jumpstart: {
        successMessage: (context: JumpstartContext) => `You successfully transferred 1 invite credit to ${context.data.recipient.value}. Please tell the recipient to reload the page.`,
        errorMessage: (context: JumpstartContext) => `The jumpstart process failed: ${context.result.error}`,
        titleProgress: () => "sending ..",
        titleSummary: () => "Confirm",
        bannerSummary: () => "Please check the recipient address and click 'Use 1 invite credit' to get this person up and running.",
        titleRecipient: () => "Invite",
        titleValue: () => "invite credits",
        bannerIntro: () => "0x123.. sent you a jumpstart request. Every transaction on the distributed computer costs a little fee. Send 1 invite credit to allow 0x123 to pay for all transaction fees that are required to join omo.",
        titleIntro: () => "Jumpstart",
        introHeader: (context: JumpstartContext) => `<span class="text-3xl">${context.data.foreignProfile.value.profile.firstName} ${context.data.foreignProfile.value.profile.lastName}</span>`,
        introSubHeader: () => `is asking you to empower his/her life`,
        introBody: (context: JumpstartContext) => {
          const recipient = context.data.recipient.value;
          const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
          const inviteCreditsLeft = Math.floor(parseFloat(context.web3.utils.fromWei(safeState.mySafeXDaiBalance?.toString() ?? "", 'ether')) * 10);
          const inviteCreditsInXDai = parseFloat(context.web3.utils.fromWei(safeState.mySafeXDaiBalance?.toString() ?? "", 'ether')).toFixed(2);

          return `You can use your invite credits to invite and unlock the ⦿ time currency of ${recipient}. You still have
                  ${inviteCreditsLeft} invite credits (${inviteCreditsInXDai} xDai) left.<br />
                  To refill your invite credits please send xDai to your safe
                  ${safeState.mySafeAddress ?? ""} or ask in the
                  <a href="https://discord.gg/KgbBdAck8X" style="color: #0D49A3">omo community</a> for help. (One invite credit = 0.10 xDai)`
        },
        loadingForeignProfile: () => "Loading the other person's profile .."
      },
      requestUbi: {
        titleProgress: () => "harvesting ..",
        "successMessage": (context: ProcessContext) => `⦿ successfully received`,
        "errorMessage": (context: ProcessContext) => `Error during ⦿ request. (Probably not sufficient xDai)`
      },
      transferCircles: {
        "successMessage": (context: SendInviteCreditsContext) => `⦿ successfully transferred`,
        "errorMessage": (context: SendInviteCreditsContext) => `⦿ transfer failed (check trust)`,
        titleRecipient: () => "Recipient",
        bannerRecipient: () => "Please enter the recipients address",
        titleValue: () => "Amount",
        bannerValue: () => "Please enter the amount (in ⦿)",
        titleProgress: () => "Sending ..",
        titleSummary: () => "Confirm",
        bannerSummary: () => "Please check the transaction details and click 'Transfer ⦿' to confirm the transaction"
      },
      intiialMenu: {
        title_initialMenu: () => "Do you have any existing accounts?",
        banner_initialMenu: () => "Please choose an existing account or click 'Just sign me up' if you are a new user",
        choice_alreadyGotCircles: () => "I already have a Circles account",
        choice_wantToReuseMyExistingPrivateKey: () => "I want to use my existing private key for Omo",
        choice_justWantToJoin: () => "Just sign me up",
      },
      initializeApp: {
        titleSafeAddress: () => "Safe",
        bannerSafeAddress: () => "Please enter your safe address",
        buttonSafeAddress: () => "Save",
        titleSeedPhrase: () => "Seedphrase",
        titleProgress: () => "connecting ...",
        bannerSeedPhrase: () => "Please enter your seed phrase",
        /*
        successMessage: (context: InitializeAppContext) => `The safe is now connected.`,
        errorMessage: (context: InitializeAppContext) => `Couldn't connect the safe.`,
        */
        titleInitializing: () => "Generating a new key ..",
        titleGenerateFundLink: () => "Get initial funding",
        buttonGenerateFundLink: () => "Close",
        bannerGenerateFundLink: async () => {
          const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
          const ownerAddress = config.getCurrent().web3()
            .eth
            .accounts
            .privateKeyToAccount(safeState.myKey.privateKey)
            .address;

          return "Send this link to a friend who invited your to get started or send 0.1 xDai to '" + ownerAddress + "'"
        },
        successDeploySafe: () => "Your new safe was successfully created",
        successConnectSafe: () => "Your existng safe was successfully connected to your Omosapien",


        progressHubSignup: () => "Registering...",
        successHubSignup: () => "Successfully registered account",
        progressFundSafe: () => "Initilizing your safe...",
        successFundSafe: () => "Safe successfully created",
        successCreatePrivateKey: () => "Private key created...",
        progressCreatePrivateKey: () => "Creating private key ..",
        progressDeploySafe: () => "Deploying your safe ..",
        fundLinkHeader: () => {
          const omosapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");
          return `Welcome ${omosapienState.myProfile.firstName} ${omosapienState.myProfile.lastName}`
        },
        fundLinkSubHeader: () => `to unlock your account send this link to a friend whow invited you`,
        fundLinkBody() {
          const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
          const ownerAddress = config.getCurrent().web3()
            .eth
            .accounts
            .privateKeyToAccount(safeState.myKey.privateKey)
            .address;
          return `To unlock yourself send 0.10 xDai to your account address (${ownerAddress}) or ask in the
      <a href="https://discord.gg/KgbBdAck8X" style="color: #0D49A3">omo
        community</a>
      for help. (One invite credit = 0.10 xDai)`
        },
        buttonBackupKey: () => `I've made a backup`,
        titleBackupKey: () => `Backup your seedphrase`,
        bannerBackupKey: () => `This is your seedphrase. It's like an unchangeable password. You should store a copy of it in a safe place to prevent you from loosing access to your funds.`,
        progressImportAccount: () => `Importing your account ...`,
        successImportAccount: () => `Successfully imported your account.`
      },
      signupAtCircles: {
        progressCreatePrivateKey: () => "Creating your key ..",
        successCreatePrivateKey: () => "Your key was successfully created.",
        titleBackupKey: () => "Safe your key",
        buttonBackupKey: () => "I've made a backup",
        bannerBackupKey: () => "Please keep a backup of this key in a safe place.",
      },
      signup: {}

    }
  }
}
