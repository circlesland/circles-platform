/** @internal */
import { Tree, File, UnixTree, BaseLinks, UpdateCallback } from '../types';
import { SemVer } from '../semver';
import { AddResult, CID, FileContent } from '../../ipfs';
import { Maybe } from '../../common';
declare abstract class BaseTree implements Tree, UnixTree {
    version: SemVer;
    constructor(version: SemVer);
    put(timeout: Maybe<number>): Promise<CID>;
    ls(path: string, timeout: Maybe<number>): Promise<BaseLinks>;
    cat(path: string, timeout: Maybe<number>): Promise<FileContent>;
    mkdir(path: string, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<this>;
    mkdirRecurse(path: string, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<this>;
    add(path: string, content: FileContent, timeout: Maybe<number>): Promise<this>;
    addRecurse(path: string, content: FileContent, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<this>;
    rm(path: string, timeout: Maybe<number>): Promise<this>;
    rmRecurse(path: string, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<this>;
    mv(from: string, to: string, timeout: Maybe<number>): Promise<this>;
    exists(path: string, timeout: Maybe<number>): Promise<boolean>;
    read(path: string, timeout: Maybe<number>): Promise<Tree | File | null>;
    write(path: string, content: FileContent, timeout: Maybe<number>): Promise<this>;
    getOrCreateDirectChild(name: string, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<Tree | File>;
    abstract createChildTree(name: string, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<Tree>;
    abstract createOrUpdateChildFile(content: FileContent, name: string, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<File>;
    abstract putDetailed(timeout: Maybe<number>): Promise<AddResult>;
    abstract updateDirectChild(child: Tree | File, name: string, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<this>;
    abstract removeDirectChild(name: string, timeout: Maybe<number>): this;
    abstract getDirectChild(name: string, timeout: Maybe<number>): Promise<Tree | File | null>;
    abstract get(path: string, timeout: Maybe<number>): Promise<Tree | File | null>;
    abstract updateLink(name: string, result: AddResult, timeout: Maybe<number>): this;
    abstract getLinks(timeout: Maybe<number>): BaseLinks;
}
export default BaseTree;
