import { Maybe } from '../common';
export declare type SemVer = {
    major: number;
    minor: number;
    patch: number;
};
export declare const encode: (major: number, minor: number, patch: number) => SemVer;
export declare const fromString: (str: string) => Maybe<SemVer>;
export declare const toString: (version: SemVer) => string;
export declare const v0: SemVer;
export declare const v1: SemVer;
export declare const latest: SemVer;
