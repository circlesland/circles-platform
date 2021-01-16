import {Envelope} from "omo-kernel-interfaces/dist/envelope";
import {FissionDrive} from "../fissionDrive";
import {BehaviorSubject} from "rxjs";

export interface FissionAuthState {
    fissionState: any,
    fission: BehaviorSubject<Envelope<FissionDrive>>,
    username: string
}
