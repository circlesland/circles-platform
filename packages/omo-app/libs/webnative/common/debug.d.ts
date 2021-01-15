export declare function newLogger(name: string, parent?: any): {
    name: string;
    parent: any;
    log: (...args: unknown[]) => void;
    newLogger: (name: string) => any;
};
