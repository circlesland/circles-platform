import { CategoryTitle } from "src/libs/o-views/interfaces/atoms";
import { AccessItem } from "src/libs/o-views/interfaces/molecules";

export const accessDevices: AccessItem[] = [
    {
        data: {
            image: "/icons/paperWallet.svg",
            title: "Seedphrase (Paper Wallet)",
            subtitle: "@Home",
        },
    },
    {
        data: {
            image: "/icons/mobileOmo.svg",
            title: "iOS HomeScreen (D)app",
            subtitle: "My iPhone",
        },
    },
    {
        data: {
            image: "/icons/mobileSafari.svg",
            title: "iOS Safari Browser",
            subtitle: "My iPhone",
        },
    },
    {
        data: {
            image: "/icons/laptopChrome.svg",
            title: "macOS Chrome Browser",
            subtitle: "My MacBook",
        },
    },
    {
        data: {
            image: "/icons/laptopFirefox.svg",
            title: "macOS Firefox Browser",
            subtitle: "My Macbook",
        },
    },
    {
        data: {
            image: "/icons/laptopOmo.svg",
            title: "macOS Desktop D(app)",
            subtitle: "My Macbook",
        },
    },
];

export const accessDapps: AccessItem[] = [
    {
        data: {
            image: "/icons/dappOmoTest.svg",
            title: "Omo Sapien",
            subtitle: "/private/apps/mamaomo/omosapien",
        },
    },
];

export const labelDevices: CategoryTitle = {
    data: {
        label: "Devices with Access to your Omo Sapien",
    },
};

export const labelDapps: CategoryTitle = {
    data: {
        label: "Dapps with Access to your Data",
    },
};