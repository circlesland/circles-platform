import { PublishHook, UnixTree, Tree, File } from './types';
import { BaseLinks } from './types';
import { SemVer } from './semver';
import RootTree from './root/tree';
import { Maybe } from '../common';
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
    constructor({ root, permissions, localOnly }: ConstructorParams);
    /**
     * Creates a file system with an empty public tree & an empty private tree at the root.
     */
    static empty(opts: FileSystemOptions | undefined, timeout: Maybe<number>): Promise<FileSystem>;
    /**
     * Loads an existing file system from a CID.
     */
    static fromCID(cid: CID, opts: FileSystemOptions | undefined, timeout: Maybe<number>): Promise<FileSystem>;
    /**
     * Deactivate a file system.
     *
     * Use this when a user signs out.
     * The only function of this is to stop listing to online/offline events.
     */
    deactivate(): void;
    mkdir(path: string, options: Maybe<MutationOptions>, timeout: Maybe<number>): Promise<this>;
    ls(path: string, timeout: Maybe<number>): Promise<BaseLinks>;
    add(path: string, content: FileContent, options: Maybe<MutationOptions>, timeout: Maybe<number>): Promise<this>;
    cat(path: string, timeout: Maybe<number>): Promise<FileContent>;
    exists(path: string, timeout: Maybe<number>): Promise<boolean>;
    rm(path: string, timeout: Maybe<number>): Promise<this>;
    get(path: string, timeout: Maybe<number>): Promise<Tree | File | null>;
    mv(from: string, to: string, timeout: Maybe<number>): Promise<this>;
    read(path: string): Promise<FileContent | null>;
    write(path: string, content: FileContent, options: MutationOptions | undefined, timeout: Maybe<number>): Promise<this>;
    /**
     * Ensures the latest version of the file system is added to IPFS,
     * updates your data root, and returns the root CID.
     */
    publish(timeout: Maybe<number>): Promise<CID>;
    /** @internal */
    runOnTree<a>(path: string, isMutation: boolean, fn: (tree: UnixTree, relPath: string) => Promise<a>, timeout: Maybe<number>): Promise<a>;
    /** @internal */
    _whenOnline(): void;
}
export default FileSystem;
