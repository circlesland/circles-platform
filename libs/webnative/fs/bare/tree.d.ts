import { Links, BaseLinks, Tree, File, Puttable, UpdateCallback } from '../types';
import { AddResult, CID, FileContent } from '../../ipfs';
import BareFile from '../bare/file';
import BaseTree from '../base/tree';
import { Maybe } from '../../common';
declare class BareTree extends BaseTree {
    links: Links;
    children: {
        [name: string]: Tree | File;
    };
    constructor(links: Links);
    static empty(): Promise<BareTree>;
    static fromCID(cid: CID, timeout: Maybe<number>): Promise<BareTree>;
    static fromLinks(links: Links): BareTree;
    createChildTree(name: string, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<Tree>;
    createOrUpdateChildFile(content: FileContent, name: string, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<BareFile>;
    putDetailed(timeout: Maybe<number>): Promise<AddResult>;
    putAndUpdateLink(child: Puttable, name: string, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<this>;
    updateDirectChild(child: Tree | File, name: string, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<this>;
    removeDirectChild(name: string): this;
    getDirectChild(name: string, timeout: Maybe<number>): Promise<Tree | File | null>;
    get(path: string, timeout: Maybe<number>): Promise<Tree | File | null>;
    updateLink(name: string, result: AddResult): this;
    getLinks(): BaseLinks;
}
export default BareTree;
