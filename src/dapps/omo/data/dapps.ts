import { faPiggyBank, faUserAstronaut, faComments, faStore, faPeopleCarry, faHeadphones, faFilm, faBook } from "@fortawesome/free-solid-svg-icons";

export const profile = {
  subtitle: "to unlock your first dapp please login",
};

export const locked = {
  data: {
    title: "Safe",
    tag: "alpha 0.1.0",
  },
  action: {
    route: "omo/dapps",
  },
  design: {
    type: "disabled",
  },
  icon: faPiggyBank,
};

export const dapps = [
  {
    data: {
      title: "Safe",
      tag: "alpha 0.1.0",
    },
    action: {
      route: "wallet/safe",
    },
    design: {
      type: "",
    },
    icon: faPiggyBank,
  },
  {
    data: {
      title: "Odentity",
      tag: "soon",
    },
    action: {
      route: "omo/dapps",
    },
    design: {
      type: "disabled",
    },
    icon: faUserAstronaut,
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
    },
    icon: faComments,
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
    },
    icon: faStore,
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
    },
    icon: faPeopleCarry,
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
    },
    icon: faFilm,
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
    },
    icon: faHeadphones,
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
    },
    icon: faBook,
  },
];
