var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { tryGetDappState } from "../../../libs/o-os/loader";
import { config } from "../../../libs/o-circles-protocol/config";
export const strings = {
    safe: {
        processes: {
            unTrust: {
                "titleTrustReceiver": () => "Revoke trust",
                "bannerTrustRecipient": () => "Please enter the address of the person you want to revoke trust",
                "titleWorking": () => "revoking trust ..",
                "successMessage": (context) => `Successfully untrusted ${context.data.trustReceiver.value.slice(0, 8)}`,
                "errorMessage": (context) => `An error occurred while untrusting ${context.data.trustReceiver.value.slice(0, 8)}.`,
            },
            setTrust: {
                "titleTrustReceiver": () => "Trust",
                "bannerTrustRecipient": () => "Please enter the address of the person you want to trust",
                "titleWorking": () => "trusting ..",
                "successMessage": (context) => `Successfully trusted ${context.data.trustReceiver.value.slice(0, 8)}`,
                "errorMessage": (context) => `An error occurred while trusting ${context.data.trustReceiver.value.slice(0, 8)}.`,
                "alreadyTrustedError": (context) => `You are already trusting ${context.data.trustReceiver.value.slice(0, 8)}.`
            },
            sendInviteCredits: {
                "successMessage": (context) => `invites successfully transferred`,
                "errorMessage": (context) => `Invite transfer failed`,
                titleRecipient: () => "Recipient",
                bannerRecipient: () => "Please enter the recipients address",
                titleValue: () => "Amount",
                bannerValue: () => "Please enter the amount (in xDai)",
                titleProgress: () => "sending ..",
                titleSummary: () => "Confirm",
                bannerSummary: () => "Please check the transaction details and confirm"
            },
            jumpstart: {
                successMessage: (context) => `You successfully transferred 1 invite credit to ${context.data.recipient.value}. Please tell the recipient to reload the page.`,
                errorMessage: (context) => `The jumpstart process failed: ${context.result.error}`,
                titleProgress: () => "sending ..",
                titleSummary: () => "Confirm",
                bannerSummary: () => "Please check the recipient address and click 'Use 1 invite credit' to get this person up and running.",
                titleRecipient: () => "Invite",
                titleValue: () => "invite credits",
                bannerIntro: () => "0x123.. sent you a jumpstart request. Every transaction on the distributed computer costs a little fee. Send 1 invite credit to allow 0x123 to pay for all transaction fees that are required to join omo.",
                titleIntro: () => "Jumpstart",
                introHeader: (context) => `<span class="text-3xl">${context.data.foreignProfile.value.firstName} ${context.data.foreignProfile.value.lastName}</span>`,
                introSubHeader: () => `is asking you to empower his/her life`,
                introBody: (context) => {
                    var _a, _b, _c, _d, _e;
                    const recipient = context.data.recipient.value;
                    const safeState = tryGetDappState("omo.safe:1");
                    const inviteCreditsLeft = Math.floor(parseFloat(context.environment.eth.web3.utils.fromWei((_b = (_a = safeState.mySafeXDaiBalance) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "", 'ether')) * 10);
                    const inviteCreditsInXDai = parseFloat(context.environment.eth.web3.utils.fromWei((_d = (_c = safeState.mySafeXDaiBalance) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "", 'ether')).toFixed(2);
                    return `You can use your invite credits to invite and unlock the ⦿ time currency of ${recipient}. You still have
                  ${inviteCreditsLeft} invite credits (${inviteCreditsInXDai} xDai) left.<br />
                  To refill your invite credits please send xDai to your safe
                  ${(_e = safeState.mySafeAddress) !== null && _e !== void 0 ? _e : ""} or ask in the
                  <a href="https://discord.gg/KgbBdAck8X" style="color: #0D49A3">omo community</a> for help. (One invite credit = 0.10 xDai)`;
                },
                loadingForeignProfile: () => "Loading the other person's profile .."
            },
            requestUbi: {
                titleProgress: () => "harvesting ..",
                "successMessage": (context) => `⦿ successfully received`,
                "errorMessage": (context) => `Error during ⦿ request. (Probably not sufficient xDai)`
            },
            transferCircles: {
                "successMessage": (context) => `⦿ successfully transferred`,
                "errorMessage": (context) => `⦿ transfer failed (check trust)`,
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
                bannerGenerateFundLink: () => __awaiter(void 0, void 0, void 0, function* () {
                    const safeState = tryGetDappState("omo.safe:1");
                    const ownerAddress = config.getCurrent().web3()
                        .eth
                        .accounts
                        .privateKeyToAccount(safeState.myKey.privateKey)
                        .address;
                    return "Send this link to a friend who invited your to get started or send 0.1 xDai to '" + ownerAddress + "'";
                }),
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
                    const omosapienState = tryGetDappState("omo.sapien:1");
                    return `Welcome ${omosapienState.myProfile.firstName} ${omosapienState.myProfile.lastName}`;
                },
                fundLinkSubHeader: () => `to unlock your account send this link to a friend whow invited you`,
                fundLinkBody() {
                    const safeState = tryGetDappState("omo.safe:1");
                    const ownerAddress = config.getCurrent().web3()
                        .eth
                        .accounts
                        .privateKeyToAccount(safeState.myKey.privateKey)
                        .address;
                    return `To unlock yourself send 0.10 xDai to your account address (${ownerAddress}) or ask in the
      <a href="https://discord.gg/KgbBdAck8X" style="color: #0D49A3">omo
        community</a>
      for help. (One invite credit = 0.10 xDai)`;
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
};
