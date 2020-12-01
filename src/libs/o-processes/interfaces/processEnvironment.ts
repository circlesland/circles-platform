import {FissionDrive} from "../../o-fission/fissionDrive";
import {Ethereum, Me} from "../../o-os/o";

export interface ProcessEnvironment {
  me: Me,
  eth: Ethereum,
  fission?: FissionDrive
}
