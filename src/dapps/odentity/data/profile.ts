import { Avataaar, Button } from "src/libs/o-views/interfaces/atoms";
import { Header, ProfileItem } from "src/libs/o-views/interfaces/molecules";

export const title: Header = { data: { title: "Profile" } };

export const buttonLogin: Button = {
    data: { label: "Auth with Fission" },
    design: { type: "secondary" },
};

export let avataaar: Avataaar = {
    data: {
        seed: null
    },
    design: {
        radius: 100,
    },
};

export let firstname: ProfileItem = {
    data: {
        title: "Omo",
        subtitle: "my first name"
    }
}

export let lastname: ProfileItem = {
    data: {
        title: "Sapiens",
        subtitle: "my last name"
    }
}

export let city: ProfileItem = {
    data: {
        title: "Planet, Earth",
        subtitle: "my home town"
    }
}
