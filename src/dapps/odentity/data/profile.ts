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
        title: "Samuel",
        subtitle: "first name"
    }
}

export let lastname = {
    data: {
        title: "Andert",
        subtitle: "last name"
    }
}

export let city = {
    data: {
        title: "Munich, Germany",
        subtitle: "city"
    }
}