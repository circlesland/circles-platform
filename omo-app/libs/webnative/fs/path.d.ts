import { NonEmptyPath } from './types';
export declare const splitParts: (path: string) => string[];
export declare const join: (parts: string[]) => string;
export declare const joinNoSuffix: (parts: string[]) => string;
declare type HeadParts = {
    head: string | null;
    nextPath: string | null;
};
export declare const takeHead: (path: string) => HeadParts;
declare type TailParts = {
    tail: string | null;
    parentPath: string | null;
};
export declare const takeTail: (path: string) => TailParts;
export declare const splitNonEmpty: (path: string) => NonEmptyPath | null;
export declare const nextNonEmpty: (parts: NonEmptyPath) => NonEmptyPath | null;
export declare const sameParent: (a: string, b: string) => boolean;
export {};
