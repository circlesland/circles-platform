import BaseTree from '../base/tree';
import MMPT from '../protocol/private/mmpt';
import PrivateFile from './PrivateFile';
import PrivateHistory from './PrivateHistory';
import { BaseLinks, UpdateCallback } from '../types';
import { DecryptedNode, PrivateSkeletonInfo, PrivateTreeInfo, PrivateAddResult } from '../protocol/private/types';
import { FileContent } from '../../ipfs';
import { PrivateName, BareNameFilter } from '../protocol/private/namefilter';
import { Maybe } from '../../common';
declare type ConstructorParams = {
    header: PrivateTreeInfo;
    key: string;
    mmpt: MMPT;
};
export default class PrivateTree extends BaseTree {
    children: {
        [name: string]: PrivateTree | PrivateFile;
    };
    header: PrivateTreeInfo;
    history: PrivateHistory;
    key: string;
    mmpt: MMPT;
    constructor({ mmpt, key, header }: ConstructorParams);
    static instanceOf(obj: any): obj is PrivateTree;
    static create(mmpt: MMPT, key: string, parentNameFilter: Maybe<BareNameFilter>): Promise<PrivateTree>;
    static fromBaseKey(mmpt: MMPT, key: string): Promise<PrivateTree>;
    static fromName(mmpt: MMPT, name: PrivateName, key: string): Promise<PrivateTree>;
    static fromInfo(mmpt: MMPT, key: string, info: PrivateTreeInfo): Promise<PrivateTree>;
    createChildTree(name: string, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<PrivateTree>;
    createOrUpdateChildFile(content: FileContent, name: string, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<PrivateFile>;
    putDetailed(timeout: Maybe<number>): Promise<PrivateAddResult>;
    updateDirectChild(child: PrivateTree | PrivateFile, name: string, onUpdate: Maybe<UpdateCallback>, timeout: Maybe<number>): Promise<this>;
    removeDirectChild(name: string): this;
    getDirectChild(name: string, timeout: Maybe<number>): Promise<PrivateTree | PrivateFile | null>;
    getName(): Promise<PrivateName>;
    updateParentNameFilter(parentNameFilter: BareNameFilter): Promise<this>;
    get(path: string, timeout: Maybe<number>): Promise<PrivateTree | PrivateFile | null>;
    getRecurse(nodeInfo: PrivateSkeletonInfo, parts: string[], timeout: Maybe<number>): Promise<Maybe<{
        key: string;
        node: DecryptedNode;
    }>>;
    getLinks(): BaseLinks;
    updateLink(name: string, result: PrivateAddResult): this;
}
export {};
