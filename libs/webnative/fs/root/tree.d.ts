import { Links, Puttable, SimpleLink } from '../types';
import { AddResult, CID } from '../../ipfs';
import { SemVer } from '../semver';
import BareTree from '../bare/tree';
import MMPT from '../protocol/private/mmpt';
import PublicTree from '../v1/PublicTree';
import PrivateTree from '../v1/PrivateTree';
import { Maybe } from "../../common";
export default class RootTree implements Puttable {
    links: Links;
    mmpt: MMPT;
    privateLog: Array<SimpleLink>;
    publicTree: PublicTree;
    prettyTree: BareTree;
    privateTree: PrivateTree;
    constructor({ links, mmpt, privateLog, publicTree, prettyTree, privateTree }: {
        links: Links;
        mmpt: MMPT;
        privateLog: Array<SimpleLink>;
        publicTree: PublicTree;
        prettyTree: BareTree;
        privateTree: PrivateTree;
    });
    static empty({ key }: {
        key: string;
    }, timeout: Maybe<number>): Promise<RootTree>;
    static fromCID({ cid, key }: {
        cid: CID;
        key: string;
    }, timeout: Maybe<number>): Promise<RootTree>;
    put(timeout: Maybe<number>): Promise<CID>;
    putDetailed(timeout: Maybe<number>): Promise<AddResult>;
    updateLink(name: string, result: AddResult): this;
    updatePuttable(name: string, puttable: Puttable, timeout: Maybe<number>): Promise<this>;
    static LOG_CHUNK_SIZE: number;
    addPrivateLogEntry(cid: string, timeout: Maybe<number>): Promise<void>;
    setVersion(version: SemVer, timeout: Maybe<number>): Promise<this>;
}
