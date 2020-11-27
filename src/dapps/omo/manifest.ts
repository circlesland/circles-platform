import Dapps from 'src/dapps/omo/views/pages/Dapps.svelte'
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { RunProcess } from 'src/libs/o-events/runProcess';
import { connectSafe } from '../safe/processes/connectSafe/connectSafe';


export const omo = {
    component: Dapps,
    userData: {
        actions: [{
            type: "trigger",
            pos: "overflow",
            mapping: {
                design: {
                    icon: faCoins,
                },
                data: {
                    label: "Connect Circles Safe"
                }
            },
            event: () => new RunProcess(connectSafe)
        }]
    }
}
