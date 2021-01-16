import { Links, Puttable, SimpleLink } from '../types';
import { AddResult, CID } from '../../ipfs';
import { SemVer } from '../semver';
import BareTree from '../bare/tree';
import MMPT from '../protocol/private/mmpt';
import PublicTree from '../v1/PublicTree';
import PrivateTree from '../v1/PrivateTree';
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
    }): Promise<RootTree>;
    static fromCID({ cid, key }: {
        cid: CID;
        key: string;
    }): Promise<RootTree>;
    put(): Promise<CID>;
    putDetailed(): Promise<AddResult>;
    updateLink(name: string, result: AddResult): this;
    updatePuttable(name: string, puttable: Puttable): Promise<this>;
    static LOG_CHUNK_SIZE: number;
    addPrivateLogEntry(cid: string): Promise<void>;
    setVersion(version: SemVer): Promise<this>;
}
