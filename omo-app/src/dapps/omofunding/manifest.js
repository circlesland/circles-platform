import Featured from './views/pages/Featured.svelte';
import { omofundingDefaultActions, omofundingOverflowActions } from './data/actions';
import { faPeopleCarry } from "@fortawesome/free-solid-svg-icons";
import { tryGetDappState } from "../../libs/o-os/loader";
export const omofunding = {
    id: "omo.funding:1",
    dependencies: [],
    icon: faPeopleCarry,
    title: "OmoFunding",
    routeParts: ["omofunding"],
    tag: Promise.resolve("mockup"),
    isEnabled: false,
    pages: [{
            isDefault: true,
            routeParts: ["featured"],
            component: Featured,
            available: [
                (detail) => {
                    console.log("routeGuard.detail:", detail);
                    const fissionAuthState = tryGetDappState("omo.fission.auth:1");
                    return fissionAuthState.fission !== undefined;
                }
            ],
            userData: {
                showActionBar: true,
                actions: [
                    ...omofundingDefaultActions,
                    ...omofundingOverflowActions
                ]
            }
        }]
};
