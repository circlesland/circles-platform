import { Permissions } from './permissions';
import { Ucan } from '../ucan';
/**
 * You didn't see anything 👀
 */
export declare function clearStorage(): Promise<void>;
/**
 * Lookup the prefix for a filesystem key in the dictionary.
 */
export declare function dictionaryFilesystemPrefix(username: string): string;
/**
 * Look up a UCAN with a file system path.
 */
export declare function lookupFilesystemUcan(path: string): Promise<Ucan | null>;
/**
 * Store UCANs and update the in-memory dictionary.
 */
export declare function store(ucans: Array<string>): Promise<void>;
/**
 * See if the stored UCANs in the in-memory dictionary
 * conform to the given `Permissions`.
 */
export declare function validatePermissions({ app, fs }: Permissions, username: string): boolean;
