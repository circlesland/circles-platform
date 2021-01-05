export class BlockIndex {
    constructor() {
        this.blocks = {};
        this.snapshots = {};
    }
    addBlock(blockNo) {
        this.blocks[blockNo] = true;
    }
    addSnapshot(name, blockNo) {
        this.snapshots[name] = blockNo;
    }
    getSnapshot(name) {
        return this.snapshots[name];
    }
    getMissingRanges(item, fromBlock, toBlock) {
        const prs = [];
        let lastSegmentBegin = fromBlock;
        for (let i = fromBlock; i < toBlock; i++) {
            if (this.blocks[i]) {
                prs.push({
                    item: item,
                    from: lastSegmentBegin,
                    to: i
                });
                lastSegmentBegin = i + 1;
            }
        }
        prs.push({
            item: item,
            from: lastSegmentBegin,
            to: toBlock
        });
        return prs;
    }
}
