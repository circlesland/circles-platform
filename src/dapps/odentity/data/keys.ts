export const keys = [
    {
        data: {
            image: "/icons/paperWallet.svg",
            title: "Circles SafeOwner",
            subtitle: "PrivateKey",
            privatekey: localStorage.getItem("omo.privateKey"),
            seedphrase: "word1, word2, word3 etc"
        },
    },
];

export const labelKeys = {
    data: {
        label: "Keys secretly stored in your localstorage",
    },
};