import { faPiggyBank, faUserAstronaut, faComments, faStore, faPeopleCarry, faHeadphones, faFilm, faBook } from "@fortawesome/free-solid-svg-icons";
import { DappIcon, ProfileHeader } from "src/libs/o-views/interfaces/molecules";

export const address: string = localStorage.getItem("omo.safeAddress");

export const profile: ProfileHeader = {
  data: {
    subtitle: "Welcome Omo",
    image: address,
  }
};

export const locked: DappIcon = {
  data: {
    title: "Safe",
    tag: "alpha 0.1.0",
  },
  action: {
    route: "omo/dapps",
  },
  design: {
    type: "disabled",
    icon: faPiggyBank,
  }
};

export const dapps: DappIcon[] = [
  {
    data: {
      title: "Safe",
      tag: "alpha 0.1.0",
    },
    action: {
      route: "safe/transactions",
    },
    design: {
      type: "",
      icon: faPiggyBank,
    },
  },
  {
    data: {
      title: "Odentity",
      tag: "alpha 0.1.0",
    },
    action: {
      route: "odentity/profile",
    },
    design: {
      icon: faUserAstronaut,
      type: "",
    },
  },
  {
    data: {
      title: "Talk",
      tag: "soon",
    },
    action: {
      route: "omo/dapps",
    },
    design: {
      type: "disabled",
      icon: faComments,
    },
  },
  {
    data: {
      title: "Market",
      tag: "soon",
    },
    action: {
      route: "omo/dapps",
    },
    design: {
      type: "disabled",
      icon: faStore,
    },
  },
  {
    data: {
      title: "Crowdfunding",
      tag: "soon",
    },
    action: {
      route: "omo/dapps",
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
      route: "omo/dapps",
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
      route: "omo/dapps",
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
      route: "omo/dapps",
    },
    design: {
      type: "disabled",
      icon: faBook,
    },
  },
];
