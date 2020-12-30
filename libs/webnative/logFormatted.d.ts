import { Maybe } from "./common";
export declare function logger(source: string): {
    log: (message: string, args?: any) => void;
    sub: (name: string) => any;
};
export declare const defaultTimeout = 30000;
export declare function withTimeout<T>(func: () => Promise<T>, timeout: Maybe<number>): Promise<T>;
export declare function logFormatted(message: string, args?: any): void;
