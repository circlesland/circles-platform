import { IPFS } from './types';
export declare const set: (userIpfs: unknown) => void;
export declare const get: () => Promise<IPFS>;
export declare function iframe(): Promise<MessagePort>;
