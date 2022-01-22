import { Nums } from "@wrule/nums";
import { Strategy } from ".";
import { IFrame } from "../frame";
import { Trader } from "../trader";

export
class Cross2LineShort
extends Strategy {
  public constructor(
    trader: Trader,
    private fastLine: Nums,
    private slowLine: Nums,
  ) {
    super(trader);
  }

  protected watch(frame: IFrame, index: number): void {
    if (index > 0) {
      const fast = this.fastLine.Nums[index];
      const slow = this.slowLine.Nums[index];
      const prevFast = this.fastLine.Nums[index - 1];
      const prevSlow = this.slowLine.Nums[index - 1];
      if (prevFast <= prevSlow && fast > slow) {
        this.Trader.CloseShort(frame);
        this.Trader.Buy(frame);
      }
      if (prevFast >= prevSlow && fast < slow) {
        this.Trader.Sell(frame);
        this.Trader.Short(frame);
      }
    }
  }
}
