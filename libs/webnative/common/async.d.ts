/**
 * Race an array of promises, returning whichever finishes first
 */
export declare function race<T>(promises: Promise<T>[]): Promise<T>;
