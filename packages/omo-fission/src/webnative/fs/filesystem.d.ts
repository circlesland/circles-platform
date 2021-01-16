import { PublishHook, UnixTree, Tree, File } from './types';
import { BaseLinks } from './types';
import { SemVer } from './semver';
import RootTree from './root/tree';
import { CID, FileContent } from '../ipfs';
import { Permissions } from '../ucan/permissions';
import { Ucan } from '../ucan';
declare type AppPath = (path?: string | Array<string>) => string;
declare type ConstructorParams = {
    permissions?: Permissions;
    root: RootTree;
    localOnly?: boolean;
};
declare type FileSystemOptions = {
    version?: SemVer;
    keyName?: string;
    permissions?: Permissions;
    localOnly?: boolean;
};
declare type MutationOptions = {
    publish?: boolean;
};
export declare class FileSystem {
    root: RootTree;
    localOnly: boolean;
    appPath: AppPath | undefined;
    proofs: {
        [_: string]: Ucan;
    };
    publishHooks: Array<PublishHook>;
    publishWhenOnline: Array<[CID, string]>;
    getIpfs(): Promise<import("../ipfs").IPFS>;
    constructor({ root, permissions, localOnly }: ConstructorParams);
    /**
     * Creates a file system with an empty public tree & an empty private tree at the root.
     */
    static empty(opts?: FileSystemOptions): Promise<FileSystem>;
    /**
     * Loads an existing file system from a CID.
     */
    static fromCID(cid: CID, opts?: FileSystemOptions): Promise<FileSystem | null>;
    /**
     * Deactivate a file system.
     *
     * Use this when a user signs out.
     * The only function of this is to stop listing to online/offline events.
     */
    deactivate(): void;
    mkdir(path: string, options?: MutationOptions): Promise<this>;
    ls(path: string): Promise<BaseLinks>;
    add(path: string, content: FileContent, options?: MutationOptions): Promise<this>;
    cat(path: string): Promise<FileContent>;
    exists(path: string): Promise<boolean>;
    rm(path: string): Promise<this>;
    get(path: string): Promise<Tree | File | null>;
    mv(from: string, to: string): Promise<this>;
    read(path: string): Promise<FileContent | null>;
    write(path: string, content: FileContent, options?: MutationOptions): Promise<this>;
    /**
     * Ensures the latest version of the file system is added to IPFS,
     * updates your data root, and returns the root CID.
     */
    publish(): Promise<CID>;
    /** @internal */
    runOnTree<a>(path: string, isMutation: boolean, fn: (tree: UnixTree, relPath: string) => Promise<a>): Promise<a>;
    /** @internal */
    _whenOnline(): void;
}
export default FileSystem;
