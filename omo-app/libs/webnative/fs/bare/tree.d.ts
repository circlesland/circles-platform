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
    static fromCID(cid: CID): Promise<BareTree>;
    static fromLinks(links: Links): BareTree;
    createChildTree(name: string, onUpdate: Maybe<UpdateCallback>): Promise<Tree>;
    createOrUpdateChildFile(content: FileContent, name: string, onUpdate: Maybe<UpdateCallback>): Promise<BareFile>;
    putDetailed(): Promise<AddResult>;
    putAndUpdateLink(child: Puttable, name: string, onUpdate: Maybe<UpdateCallback>): Promise<this>;
    updateDirectChild(child: Tree | File, name: string, onUpdate: Maybe<UpdateCallback>): Promise<this>;
    removeDirectChild(name: string): this;
    getDirectChild(name: string): Promise<Tree | File | null>;
    get(path: string): Promise<Tree | File | null>;
    updateLink(name: string, result: AddResult): this;
    getLinks(): BaseLinks;
}
export default BareTree;
