import { AddResult, CID } from "../../../ipfs";
import { Puttable, SimpleLinks } from '../../types';
declare type Member = {
    name: string;
    cid: string;
};
/**
 * Modified Merkle Patricia Tree
 * The tree has a node weight of 16
 * It stores items with hexidecimal keys and creates a new layer when a given layer has two keys that start with the same nibble
 */
export default class MMPT implements Puttable {
    links: SimpleLinks;
    children: {
        [name: string]: MMPT;
    };
    constructor(links: SimpleLinks);
    static create(): MMPT;
    static fromCID(cid: CID): Promise<MMPT>;
    putDetailed(): Promise<AddResult>;
    put(): Promise<CID>;
    add(name: string, value: CID): Promise<void>;
    putAndUpdateLink(name: string, child: MMPT): Promise<void>;
    addEmptyChild(name: string): MMPT;
    get(name: string): Promise<CID | null>;
    exists(name: string): Promise<boolean>;
    members(): Promise<Array<Member>>;
    private getDirectChild;
    private removeChild;
    private directChildExists;
    private nextTreeName;
    private nextTreeOrSiblingName;
}
export {};
