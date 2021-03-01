export const strings = {
  omomarket: {
    processes: {
      createOffer: {
        successMessage: (context: any) => `Your offer was successfully created`,
        errorMessage: (context: any) => `An error occurred during the creation of your offer`,
        titleProductName: () => "Product Title",
        bannerProductName: () => "Describe in short your offer title",
        buttonProductName: () => "Save title",
        titleProductPicture: () => "Product Image",
        bannerProductPicture: () => "Upload product an image",
        buttonProductPicture: () => "Save image",
        titleProductPrice: () => "Product Price",
        bannerProductPrice: () => "Set the price in ⦿",
        buttonProductPrice: () => "Save price",
        titleProductDescription: () => "Description",
        bannerProductDescription: () => "Describe more details about your offer",
        buttonProductDescription: () => "Save Details",
        titleProductShipping: () => "Shipping Details",
        bannerProductShipping: () => "Is your product for pick-up or will you send it?",
        buttonProductShipping: () => "Save",
        titleProductLocation: () => "Product Location",
        bannerProductLocation: () => "From where do you sell or send your product?",
        buttonProductLocation: () => "Save location",
        titleSummary: () => "Summary",
        bannerSummary: () => "",
        buttonSummary: () => "Save Offer",
        bannerProgress: () => "Creating your offer .."
      },
      publishOffer: {
        successMessage: (context: any) => `Your offer was successfully published`,
        errorMessage: (context: any) => `An error occurred during publishing. Refresh the page and try again if necessary.`,
        title: () => "Publishing ..",
        bannerProgress: () => "Publishing .."
      },
      unlistOffer: {
        successMessage: (context: any) => `Your offer was successfully un-published`,
        errorMessage: (context: any) => `An error occurred during un-publishing. Refresh the page and try again if necessary.`,
        title: () => "Un-publishing ..",
        bannerProgress: () => "Un-publishing .."
      }
    }
  }
}
