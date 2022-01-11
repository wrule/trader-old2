import { Nums } from "@wrule/nums";
import { Bill } from "../bill";
import { IFrame } from "../frame";
import { Cross2Line } from "../strategy/Cross2Line";
import { Trader } from "../trader";

export
class Cross2LineFinder {
  public constructor(
    private trader: Trader,
    private frames: IFrame[],
    private lines: Nums[],
  ) { }

  public Find(filter: (bill: Bill) => boolean) {
    const result: Bill[] = [];
    for (let fastIndex = 0; fastIndex < this.lines.length - 1; ++fastIndex) {
      for (let slowIndex = fastIndex + 1; slowIndex < this.lines.length; ++slowIndex) {
        const strategy = new Cross2Line(this.trader, this.lines[fastIndex], this.lines[slowIndex]);
        strategy.Backtesting(this.frames);
        if (filter(this.trader.Bill)) {
          result.push(this.trader.Bill);
        }
      }
    }
    return result;
  }
}
