export interface MissingRange<T>
{
  isKnownEmpty?: boolean,
  item: T,
  from: number,
  to: number
}

export class BlockIndex
{
  blocks:{[blockNo:number]:boolean} = {};
  snapshots:{[name:string]:number} = {};

  addBlock(blockNo:number)
  {
    this.blocks[blockNo] = true;
  }

  addSnapshot(name:string, blockNo:number)
  {
    this.snapshots[name] = blockNo;
  }

  getSnapshot(name:string): number
  {
    return this.snapshots[name];
  }

  getMissingRanges<T>(item:T, fromBlock:number, toBlock:number):MissingRange<T>[]
  {
    const prs:MissingRange<T>[] = [];
    let lastSegmentBegin = fromBlock;

    for (let i = fromBlock; i < toBlock; i++)
    {
      if (this.blocks[i])
      {
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
