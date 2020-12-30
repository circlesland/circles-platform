import { Maybe } from '../common';
import { FileContent, CID, AddResult } from '../ipfs';
import { SemVer } from './semver';
export interface File extends Puttable {
    content: FileContent;
    updateContent(content: FileContent, timeout: Maybe<number>): Promise<this>;
}
export interface SimpleLink {
    name: string;
    size: number;
    cid: CID;
}
export interface BaseLink {
    name: string;
    size: number;
    mtime?: number;
    isFile: boolean;
}
export interface Link extends SimpleLink, BaseLink {
}
export interface SimpleLinks {
    [name: string]: SimpleLink;
}
export interface BaseLinks {
    [name: string]: BaseLink;
}
export interface Links {
    [name: string]: Link;
}
export declare enum Branch {
    Public = "public",
    Pretty = "p",
    Private = "private",
    PrivateLog = "privateLog",
    Version = "version"
}
export declare type NonEmptyPath = [string, ...string[]];
export interface Puttable {
    put(timeout: Maybe<number>): Promise<CID>;
    putDetailed(timeout: Maybe<number>): Promise<AddResult>;
}
export declare type UpdateCallback = () => Promise<unknown>;
export declare type PublishHook = (result: CID, proof: string) => unknown;
export interface UnixTree {
    ls(path: string, timeout: Maybe<number>): Promise<BaseLinks>;
    mkdir(path: string, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<this>;
    cat(path: string, timeout: Maybe<number>): Promise<FileContent>;
    add(path: string, content: FileContent, timeout: Maybe<number>): Promise<this>;
    rm(path: string, timeout: Maybe<number>): Promise<this>;
    mv(from: string, to: string, timeout: Maybe<number>): Promise<this>;
    get(path: string, timeout: Maybe<number>): Promise<Tree | File | null>;
    exists(path: string, timeout: Maybe<number>): Promise<boolean>;
}
export interface Tree extends UnixTree, Puttable {
    version: SemVer;
    createChildTree(name: string, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<Tree>;
    createOrUpdateChildFile(content: FileContent, name: string, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<File>;
    mkdirRecurse(path: string, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<this>;
    addRecurse(path: string, content: FileContent, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<this>;
    rmRecurse(path: string, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<this>;
    updateDirectChild(child: Tree | File, name: string, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<this>;
    removeDirectChild(name: string, timeout: Maybe<number>): this;
    getDirectChild(name: string, timeout: Maybe<number>): Promise<Tree | File | null>;
    getOrCreateDirectChild(name: string, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<Tree | File>;
    updateLink(name: string, result: AddResult, timeout: Maybe<number>): this;
    getLinks(timeout: Maybe<number>): BaseLinks;
}
