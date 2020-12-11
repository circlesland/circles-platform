import { faPiggyBank, faUserAstronaut, faComments, faStore, faPeopleCarry, faHeadphones, faFilm, faBook, faSave, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { DappIcon, ProfileHeader } from "src/libs/o-views/interfaces/molecules";
import { getEnvironment } from "../../../libs/o-os/o";

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
        tag: "alpha",
      },
      action: {
        route: "#/omosapien/profile",
      },
      design: {
        icon: faUserAstronaut,
        type: "",
      },
    },
    {
      data: {
        title: "OmoSafe",
        tag: "alpha",
      },
      action: {
        route: "#/safe/transactions",
      },
      design: {
        type: environment.me.mySafe ? "" : "disabled",
        icon: faPiggyBank,
      },
    },
    {
      data: {
        title: "OmoMarket",
        tag: "mockup",
      },
      action: {
        route: "#/omomarket/offers",
      },
      design: {
        type: "",
        icon: faStore,
      },
    },
    {
      data: {
        title: "OmoFunding",
        tag: "mockup",
      },
      action: {
        route: "#/omofunding/featured",
      },
      design: {
        type: "",
        icon: faPeopleCarry,
      },
    },
    {
      data: {
        title: "Fission Drive",
        tag: "beta",
      },
      action: {
        route: "https://drive.fission.codes",
      },
      design: {
        type: "",
        icon: faSave,
      },
    },
    {
      data: {
        title: "Fission Auth",
        tag: "beta",
      },
      action: {
        route: "https://auth.fission.codes",
      },
      design: {
        type: "",
        icon: faCheckCircle,
      },
    },
    {
      data: {
        title: "Talk",
        tag: "soon",
      },
      action: {
        route: "#/omoli/dapps",
      },
      design: {
        type: "disabled",
        icon: faComments,
      },
    },
    {
      data: {
        title: "Movies",
        tag: "soon",
      },
      action: {
        route: "#/omoli/dapps",
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
        route: "#/omoli/dapps",
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
        route: "#/omoli/dapps",
      },
      design: {
        type: "disabled",
        icon: faBook,
      },
    },
  ];
}
