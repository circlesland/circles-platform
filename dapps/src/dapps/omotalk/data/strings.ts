export const strings = {
  omotalk: {
    processes: {
      sendMessage: {
        titleRecipient: () => 'Recipient',
        bannerRecipient: () => 'Who should receive the message?',
        bannerPromptText: () => "Please enter your message below",
        successMessage: (context: any) => `Your message was sent`,
        errorMessage: (context: any) => `Your message couldn't be sent. You can try to send it again from the drafts-page.`,
        buttonSend: () => "Send",

        titleProductName: () => "Product Title",
        bannerProductName: () => "Describe in short your offer title",
        buttonProductName: () => "Save title",
        titleProductPicture: () => "Product Image",
        bannerProductPicture: () => "Upload product an image",
        buttonProductPicture: () => "Save image",
        titleProductPrice: () => "Product Price",
        bannerProductPrice: () => "Set the price in ⦿",
        buttonProductPrice: () => "Save price",
        titlePromptText: () => "Description",
        titleProductShipping: () => "Shipping Details",
        bannerProductShipping: () => "Is your product for pick-up or will you send it?",
        buttonProductShipping: () => "Save",
        titleProductLocation: () => "Product Location",
        bannerProductLocation: () => "From where do you sell or send your product?",
        buttonProductLocation: () => "Save location",
        titleSummary: () => "Summary",
        bannerSummary: () => "",
        buttonSummary: () => "Save Offer",
        bannerProgress: () => "Sending your message .."
      }
    }
  }
}
