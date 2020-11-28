export const title = { data: { title: "Profile" } };

export const buttonLogin = {
    data: { label: "Auth with Fission" },
    design: { type: "secondary" },
};

export let avataaar = {
    data: {
        seed: localStorage.getItem("omo.safeAddress"),
    },
    design: {
        radius: 100,
    },
};

export let firstname = {
    data: {
        title: "Omo",
        subtitle: "my first name"
    }
}

export let lastname = {
    data: {
        title: "Sapiens",
        subtitle: "my last name"
    }
}

export let city = {
    data: {
        title: "Planet, Earth",
        subtitle: "my home town"
    }
}