import { Avataaar } from "src/libs/o-views/interfaces/atoms";
import { Header, DataFieldMapping } from "src/libs/o-views/interfaces/molecules";

export const title: Header = { data: { title: "Profile" } };

export let avataaar: Avataaar = {
  data: {
    seed: "(await window.o.safe()).address"
  },
  design: {
    radius: 100,
  },
};

export let firstname: DataFieldMapping = {
  data: {
    title: "Omo",
    subtitle: "my first name"
  }
}

export let lastname: DataFieldMapping = {
  data: {
    title: "Sapien",
    subtitle: "my last name"
  }
}

export let city: DataFieldMapping = {
  data: {
    title: "Planet, Earth",
    subtitle: "my home town"
  }
}
