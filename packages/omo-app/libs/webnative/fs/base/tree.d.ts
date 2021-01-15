/** @internal */
import { Tree, File, UnixTree, BaseLinks, UpdateCallback } from '../types';
import { SemVer } from '../semver';
import { AddResult, CID, FileContent } from '../../ipfs';
import { Maybe } from '../../common';
declare abstract class BaseTree implements Tree, UnixTree {
    version: SemVer;
    constructor(version: SemVer);
    put(): Promise<CID>;
    ls(path: string): Promise<BaseLinks>;
    cat(path: string): Promise<FileContent>;
    mkdir(path: string): Promise<this>;
    mkdirRecurse(path: string, onUpdate: Maybe<UpdateCallback>): Promise<this>;
    add(path: string, content: FileContent): Promise<this>;
    addRecurse(path: string, content: FileContent, onUpdate: Maybe<UpdateCallback>): Promise<this>;
    rm(path: string): Promise<this>;
    rmRecurse(path: string, onUpdate: Maybe<UpdateCallback>): Promise<this>;
    mv(from: string, to: string): Promise<this>;
    exists(path: string): Promise<boolean>;
    read(path: string): Promise<Tree | File | null>;
    write(path: string, content: FileContent): Promise<this>;
    getOrCreateDirectChild(name: string, onUpdate: Maybe<UpdateCallback>): Promise<Tree | File>;
    abstract createChildTree(name: string, onUpdate: Maybe<UpdateCallback>): Promise<Tree>;
    abstract createOrUpdateChildFile(content: FileContent, name: string, onUpdate: Maybe<UpdateCallback>): Promise<File>;
    abstract putDetailed(): Promise<AddResult>;
    abstract updateDirectChild(child: Tree | File, name: string, onUpdate: Maybe<UpdateCallback>): Promise<this>;
    abstract removeDirectChild(name: string): this;
    abstract getDirectChild(name: string): Promise<Tree | File | null>;
    abstract get(path: string): Promise<Tree | File | null>;
    abstract updateLink(name: string, result: AddResult): this;
    abstract getLinks(): BaseLinks;
}
export default BaseTree;
