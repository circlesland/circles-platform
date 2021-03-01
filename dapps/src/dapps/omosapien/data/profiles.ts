import { CategoryTitle } from "src/libs/o-views/interfaces/atoms";
import { ProfileItem } from "src/libs/o-views/interfaces/molecules";

export const omoSapiens: ProfileItem[] = [
  {
    data: {
      image: "images/users/samuel.jpg",
      title: "Samuel Andert",
      subtitle: "key: me",
    },
  },
  {
    data: {
      image: "images/users/chuck.jpg",
      title: "Chukwuma Nwokolo",
      subtitle: "key: chuck",
    },
  },
  {
    data: {
      image: "images/users/olivia.jpg",
      title: "Olivia Okafor",
      subtitle: "key: olivia",
    },
  }
];

export const coops: ProfileItem[] = [
  {
    data: {
      image: "/logos/omo.svg",
      title: "Omo Earth",
      subtitle: "key: me",
    },
  },
];

export const labelOmoSapiens: CategoryTitle = {
  data: {
    label: "Omo Sapiens",
  },
};

export const labelCoops: CategoryTitle = {
  data: {
    label: "Coops",
  },
};