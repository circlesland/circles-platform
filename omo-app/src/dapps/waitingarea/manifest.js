import WaitingArea from "./pages/WaitingArea.svelte";
import { faHourglass } from "@fortawesome/free-solid-svg-icons";
export const waitingarea = {
    id: "omo.waitingarea:1",
    dependencies: [],
    isHidden: true,
    icon: faHourglass,
    title: "Waiting area",
    routeParts: ["waiting-area"],
    tag: Promise.resolve("alpha"),
    isEnabled: true,
    pages: [{
            isDefault: true,
            routeParts: ["please-wait"],
            component: WaitingArea,
            available: []
        }]
};
