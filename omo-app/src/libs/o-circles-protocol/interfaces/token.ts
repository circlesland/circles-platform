import type { Addressable } from "./addressable";
import type { Address } from "./address";
import type { BN } from "ethereumjs-util";

/**
 * Represents a participant's token.
 */
export interface Token extends Addressable {
  getBalanceOf(address: Address): Promise<BN>;
}
