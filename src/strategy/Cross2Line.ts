import { Nums } from "@wrule/nums";
import { Strategy } from ".";
import { IFrame } from "../frame";
import { Trader } from "../trader";

export
class Cross2Line
extends Strategy {
  public constructor(
    trader: Trader,
    private slowLine: Nums,
    private fastLine: Nums,
  ) {
    super(trader);
  }

  protected Watch(frame: IFrame, index: number): void {
    if (index > 0) {
      const fast = this.fastLine.Nums[index];
      const slow = this.slowLine.Nums[index];
      const prevFast = this.fastLine.Nums[index - 1];
      const prevSlow = this.slowLine.Nums[index - 1];
      if (prevFast <= prevSlow && fast > slow) {
        this.Trader.Buy(frame);
      }
      if (prevFast >= prevSlow && fast < slow) {
        this.Trader.Sell(frame);
      }
    }
  }
}
