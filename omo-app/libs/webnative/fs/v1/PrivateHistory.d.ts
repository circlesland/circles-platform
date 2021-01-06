import MMPT from "../protocol/private/mmpt";
import { BareNameFilter } from '../protocol/private/namefilter';
import { DecryptedNode, Revision } from "../protocol/private/types";
import { Maybe } from '../../common';
import { Metadata } from '../metadata';
export declare type Node = {
    constructor: {
        fromInfo: (mmpt: MMPT, key: string, info: DecryptedNode) => Node;
    };
    header: {
        bareNameFilter: BareNameFilter;
        metadata: Metadata;
        revision: number;
    };
    key: string;
    mmpt: MMPT;
};
export default class PrivateHistory {
    readonly node: Node;
    constructor(node: Node);
    /**
     * Go back one or more versions.
     *
     * @param delta Optional negative number to specify how far to go back
     */
    back(delta?: number): Promise<Maybe<Node>>;
    /**
     * Get a version before a given timestamp.
     *
     * @param timestamp Unix timestamp in seconds
     */
    prior(timestamp: number): Promise<Maybe<Node>>;
    /**
     * List earlier versions along with the timestamp they were created.
     */
    list(amount?: number): Promise<Array<{
        delta: number;
        timestamp: number;
    }>>;
    /**
     * @internal
     */
    _getRevision(revision: number): Promise<Maybe<Node>>;
    /**
     * @internal
     */
    _getRevisionInfo(revision: Revision): Promise<DecryptedNode>;
    /**
     * @internal
     */
    _getRevisionInfoFromNumber(revision: number): Promise<Maybe<DecryptedNode>>;
    /**
     * @internal
     */
    _prior(revision: number, timestamp: number): Promise<Maybe<Node>>;
}
