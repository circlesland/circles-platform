import { CreateOmoSapienContext } from "../processes/createOmoSapien/createOmoSapien"

export const strings = {
  omosapien: {
    processes: {
      createOmoSapien: {
        successMessage: (context: CreateOmoSapienContext) => `Your OmoSapien was successfully created`,
        errorMessage: (context: CreateOmoSapienContext) => `An error occured during the creation of your OmoSapien`,
        titleFirstName: () => `First name`,
        buttonFirstName: () => `Save`,
        bannerFirstName: () => `Please enter your first name`,
        titleLastName: () => `Last name`,
        buttonLastName: () => `Save`,
        bannerLastName: () => `Please enter your last name`,
        titleAvatar: () => `Avatar`,
        buttonAvatar: () => `Save`,
        bannerAvatar: () => `Please upload an avatar`,
        bannerProgress: () => `Creating your OmoSapien ...`,
        titleConnectSafe: () => `Create or connect safe`,
        bannerConnectSafe: () => `Connect an existing safe or create a new one`,
        choiceExistingSafe: () => `Existing safe`,
        choiceNewSafe: () => `New safe`,
      }
    }
  }
}
