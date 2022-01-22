import { Nums } from "@wrule/nums";
import { Bill } from "../bill";
import { IFrame } from "../frame";
import { Cross2Line } from "../strategy/Cross2Line";
import { Cross2LineShort } from "../strategy/Cross2LineShort";
import { Trader } from "../trader";

export
class Cross2LineFinder {
  public constructor(
    private trader: Trader,
    private frames: IFrame[],
    private lines: Nums[],
  ) { }

  public Find(
    config: {
      filter?: (bill: Bill) => boolean,
      sorter?: (bill1: Bill, bill2: Bill) => number,
      limit?: number,
    } = { } as any,
  ) {
    config.filter = config.filter || ((bill: Bill) => bill.IsProfit && bill.IsBetter && bill.WinRate >= 40);
    config.sorter = config.sorter || ((bill1: Bill, bill2: Bill) => bill2.TotalProfitRate - bill1.TotalProfitRate);
    config.limit = config.limit || 40;
    const result: Bill[] = [];
    for (let fastIndex = 0; fastIndex < this.lines.length - 1; ++fastIndex) {
      for (let slowIndex = fastIndex + 1; slowIndex < this.lines.length; ++slowIndex) {
        const strategy = new Cross2LineShort(this.trader, this.lines[fastIndex], this.lines[slowIndex]);
        const bill = strategy.Backtesting(this.frames);
        bill.SetId(`${fastIndex}-${slowIndex}`);
        if (config.filter(bill)) {
          result.push(bill);
        }
      }
    }
    result.sort(config.sorter);
    return result.slice(0, config.limit);
  }
}
