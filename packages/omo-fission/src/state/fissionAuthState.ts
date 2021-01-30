import {StatePropagation} from "omo-kernel-interfaces/dist/statePropagation";
import {FissionDrive} from "../fissionDrive";
import {OmoBehaviorSubject} from "omo-quirks/dist/OmoBehaviorSubject";

export interface FissionAuthState {
    fissionState: any,
    fission: OmoBehaviorSubject<StatePropagation<FissionDrive>>,
    username: string
}
