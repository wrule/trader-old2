import { Nums, nums } from '@wrule/nums';
import { Bill } from '../bill';
import { IFrame } from '../frame';
import { BreakZero } from '../strategy/BreakZero';
import { Cross2Line } from '../strategy/Cross2Line';
import { Trader } from '../trader';

export
class MACDFinder2 {
  public constructor(
    private trader: Trader,
    private frames: IFrame[],
    private maxSize: number,
    private maxSmooth: number,
    private maxMA: number,
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
        console.log(slow);
        for (let smooth = 1; smooth <= this.maxSmooth; ++ smooth) {
          const { MACD } = this.PriceNums.MACD(fast, slow, smooth);
          for (let maFast = 1; maFast < this.maxMA; ++maFast) {
            for (let maSlow = maFast + 1; maSlow <= this.maxMA; ++maSlow) {
              const maFastLine = MACD.MA(maFast);
              const maSlowLine = MACD.MA(maSlow);
              const strategy = new Cross2Line(this.trader, maFastLine, maSlowLine);
              const bill = strategy.Backtesting(this.frames);
              bill.SetId(`${fast}-${slow}-${smooth}-${maFast}-${maSlow}`);
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
      }
    }
    return result;
  }
}
