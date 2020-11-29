import {CreateOdentityContext} from "../processes/createOdentity/createOdentity";

export const strings = {
  odentity: {
    processes: {
      createOdentity: {
        successMessage: (context: CreateOdentityContext) => `Your odentity was successfully created`,
        errorMessage: (context: CreateOdentityContext) => `An error occured during the creation of your odentity`,
        titleFirstName: () => `First name`,
        buttonFirstName: () => `Save`,
        bannerFirstName: () => `Please enter your first name`,
        titleLastName: () => `Last name`,
        buttonLastName: () => `Save`,
        bannerLastName: () => `Please enter your last name`,
        titleAvatar: () => `Avatar`,
        buttonAvatar: () => `Save`,
        bannerAvatar: () => `Please upload an avatar`,
        bannerProgress: () => `Creating your odentity ...`,
        titleConnectSafe: () => `Create or connect safe`,
        bannerConnectSafe: () => `Connect an existing safe or create a new one`,
        choiceExistingSafe: () => `Existing safe`,
        choiceNewSafe: () => `New safe`,
      },
      authenticate: {

      }
    }
  }
}
