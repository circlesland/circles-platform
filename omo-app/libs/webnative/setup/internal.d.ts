export declare type Endpoints = {
    api: string;
    lobby: string;
    user: string;
};
/**
 * @internal
 */
export declare const setup: {
    debug: boolean;
    logger?: (...args: any[]) => void;
    endpoints: {
        api: string;
        lobby: string;
        user: string;
    };
};
