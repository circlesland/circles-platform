import { CategoryTitle } from "src/libs/o-views/interfaces/atoms";
import { KeyItem } from "src/libs/o-views/interfaces/molecules";

export const keys: KeyItem[] = [
    {
        data: {
            image: "/icons/paperWallet.svg",
            title: "Circles SafeOwner",
            subtitle: "PrivateKey",
            privatekey: localStorage.getItem("omo.privateKey"),
        },
    },
];

export const labelKeys: CategoryTitle = {
    data: {
        label: "Keys secretly stored in your localstorage",
    },
};