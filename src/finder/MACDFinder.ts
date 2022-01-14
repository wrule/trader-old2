import { Nums, nums } from '@wrule/nums';
import { Bill } from '../bill';
import { IFrame } from '../frame';
import { BreakZero } from '../strategy/BreakZero';
import { Trader } from '../trader';

export
class MACDFinder {
  public constructor(
    private trader: Trader,
    private frames: IFrame[],
    private maxSize: number,
    private maxSmooth: number,
  ) {
    this.priceNums = nums(this.frames.map((frame) => frame.price));
  }

  private priceNums!: Nums;

  public get PriceNums() {
    return this.priceNums;
  }

  public Find(
    config: {
      filter?: (bill: Bill) => boolean,
      sorter?: (bill1: Bill, bill2: Bill) => number,
      limit?: number,
    } = { } as any,
  ) {
    config.filter = config.filter || ((bill: Bill) => bill.IsProfit && bill.IsBetter && bill.WinRate >= 50);
    config.sorter = config.sorter || ((bill1: Bill, bill2: Bill) => bill2.TotalProfitRate - bill1.TotalProfitRate);
    config.limit = config.limit || 50;
    let result: Bill[] = [];
    for (let fast = 1; fast < this.maxSize; ++fast) {
      console.log(`[${fast}/${this.maxSize - 1}]...`);
      for (let slow = fast + 1; slow <= this.maxSize; ++slow) {
        for (let smooth = 1; smooth <= this.maxSmooth; ++ smooth) {
          const { MACD } = this.PriceNums.MACD(fast, slow, smooth);
          const strategy = new BreakZero(this.trader, MACD);
          const bill = strategy.Backtesting(this.frames);
          bill.SetId(`${fast}-${slow}-${smooth}`);
          if (config.filter(bill)) {
            result.push(bill);
          }
          result.sort(config.sorter);
          if (result.length > config.limit) {
            result.splice(config.limit, 1);
          }
        }
      }
    }
    return result;
  }
}
