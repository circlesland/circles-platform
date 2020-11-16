import {SetTrustContext} from "../processes/setTrust/setTrust";

export const strings = {
    wallet: {
        processes: {
            setTrust: {
                "trustConfirmation": (context: SetTrustContext) => `Click 'Next' to add ${context.setTrust.trustReceiver.data} to your list of trusted persons.`,
                "untrustConfirmation": (context: SetTrustContext) => `Click 'Next' to remove ${context.setTrust.trustReceiver.data} from your list of trusted persons.`,
                "setTrustProgress":  (context: SetTrustContext) => context.setTrust.trustLimit.data > 0 ? "Trusting .." : "Untrusting ..",
                "setTrustSuccess": (context: SetTrustContext) => context.setTrust.trustLimit.data > 0
                    ? `Successfully trusted ${context.setTrust.trustReceiver.data}`
                    : `Successfully untrusted ${context.setTrust.trustReceiver.data}`,
                "setTrustError": (context: SetTrustContext) => context.setTrust.trustLimit.data > 0
                    ? `An error occurred while trusting ${context.setTrust.trustReceiver.data}.`
                    : `An error occurred while untrusting ${context.setTrust.trustReceiver.data}.`,
                "alreadyTrustedError": (context: SetTrustContext) => `You are already trusting ${context.setTrust.trustReceiver.data}.`
            }
        }
    }
}
