import { Maybe } from "./types";
export declare const removeKeyFromObj: <T>(obj: {
    [key: string]: T;
}, key: string) => {
    [key: string]: T;
};
export declare const updateOrRemoveKeyFromObj: <T>(obj: {
    [key: string]: T;
}, key: string, val: Maybe<T>) => {
    [key: string]: T;
};
export declare const mapObj: <T, S>(obj: {
    [key: string]: T;
}, fn: (val: T, key: string) => S) => {
    [key: string]: S;
};
export declare const mapObjAsync: <T, S>(obj: {
    [key: string]: T;
}, fn: (val: T, key: string) => Promise<S>) => Promise<{
    [key: string]: S;
}>;
export declare const arrContains: <T>(arr: T[], val: T) => boolean;
export declare const asyncWaterfall: <T>(val: T, operations: ((val: T) => Promise<T>)[]) => Promise<T>;
