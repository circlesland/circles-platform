import RSAKeyStore from 'keystore-idb/rsa/keystore';
export declare const clear: () => Promise<void>;
export declare const set: (userKeystore: RSAKeyStore) => Promise<void>;
export declare const get: () => Promise<RSAKeyStore>;
