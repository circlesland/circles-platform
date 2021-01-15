export declare function get(): Promise<Array<string>>;
export declare function index(cid: string): Promise<[number, number]>;
export declare function newest(): Promise<string>;
export declare function add(cid: string): Promise<void>;
export declare function clear(): Promise<void>;
