import { Entity } from "./entity";
import {Token} from "./token";

export interface CachedTokens extends Entity {
  entries: {
    [tokenAddress:string]: Token
  }
}
