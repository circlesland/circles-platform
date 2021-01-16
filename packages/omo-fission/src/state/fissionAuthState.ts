import {StatePropagation} from "omo-kernel-interfaces/dist/statePropagation";
import {FissionDrive} from "../fissionDrive";
import {BehaviorSubject} from "rxjs";

export interface FissionAuthState {
    fissionState: any,
    fission: BehaviorSubject<StatePropagation<FissionDrive>>,
    username: string
}
