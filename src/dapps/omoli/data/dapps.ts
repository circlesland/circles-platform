import { faPiggyBank, faUserAstronaut, faComments, faStore, faPeopleCarry, faHeadphones, faFilm, faBook } from "@fortawesome/free-solid-svg-icons";
import { DappIcon, ProfileHeader } from "src/libs/o-views/interfaces/molecules";
import { getEnvironment } from "../../../libs/o-os/o";
import { asyncWaterfall } from "webnative/common";

export const address: string = "TODO";

export const profile: ProfileHeader = {
  data: {
    subtitle: "Welcome Omo",
    image: address,
  }
};

export const dapps: () => Promise<DappIcon[]> = async () => {
  const environment = await getEnvironment();
  return [
    {
      data: {
        title: "OmoSapien",
        tag: "soon",
      },
      action: {
        route: "omosapien/profile",
      },
      design: {
        icon: faUserAstronaut,
        type: "",
      },
    },
    {
      data: {
        title: "Safe",
        tag: "",
      },
      action: {
        route: "safe/transactions",
      },
      design: {
        type: environment.me.mySafe ? "" : "disabled",
        icon: faPiggyBank,
      },
    },
    {
      data: {
        title: "Market",
        tag: "soon",
      },
      action: {
        route: "omomarket/offers",
      },
      design: {
        type: "",
        icon: faStore,
      },
    },
    {
      data: {
        title: "Talk",
        tag: "soon",
      },
      action: {
        route: "omoli/dapps",
      },
      design: {
        type: "disabled",
        icon: faComments,
      },
    },

    {
      data: {
        title: "Crowdfunding",
        tag: "soon",
      },
      action: {
        route: "omoli/dapps",
      },
      design: {
        type: "disabled",
        icon: faPeopleCarry,
      },
    },
    {
      data: {
        title: "Movies",
        tag: "soon",
      },
      action: {
        route: "omoli/dapps",
      },
      design: {
        type: "disabled",
        icon: faFilm,
      },
    },
    {
      data: {
        title: "Musik",
        tag: "soon",
      },
      action: {
        route: "omoli/dapps",
      },
      design: {
        type: "disabled",
        icon: faHeadphones,
      },
    },
    {
      data: {
        title: "Books",
        tag: "soon",
      },
      action: {
        route: "omoli/dapps",
      },
      design: {
        type: "disabled",
        icon: faBook,
      },
    },
  ];
}
