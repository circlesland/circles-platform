import { Avataaar } from "src/libs/o-views/interfaces/atoms";
import { Header, ProfileField } from "src/libs/o-views/interfaces/molecules";

export const title: Header = { data: { title: "Profile" } };

export let avataaar: Avataaar = {
  data: {
    seed: "(await window.o.safe()).address"
  },
  design: {
    radius: 100,
  },
};

export let firstname: ProfileField = {
  data: {
    title: "Omo",
    subtitle: "my first name"
  }
}

export let lastname: ProfileField = {
  data: {
    title: "Sapien",
    subtitle: "my last name"
  }
}

export let city: ProfileField = {
  data: {
    title: "Planet, Earth",
    subtitle: "my home town"
  }
}
