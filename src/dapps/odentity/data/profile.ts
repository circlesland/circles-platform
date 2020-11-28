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