export declare const getKeyByName: (keyName: string) => Promise<string>;
export declare const encrypt: (data: Uint8Array, keyStr: string) => Promise<Uint8Array>;
export declare const decrypt: (encrypted: Uint8Array, keyStr: string) => Promise<Uint8Array>;
export declare const genKeyStr: () => Promise<string>;
export declare const sha256Str: (str: string) => Promise<string>;
export declare const sha256: (buf: ArrayBuffer) => Promise<ArrayBuffer>;
