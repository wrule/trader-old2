import { Nums } from "@wrule/nums";
import { Strategy } from ".";
import { IFrame } from "../frame";
import { Trader } from "../trader";

export
class BreakZero
extends Strategy {
  public constructor(
    trader: Trader,
    private line: Nums,
  ) {
    super(trader);
  }

  protected watch(frame: IFrame, index: number): void {
    if (index > 0) {
      const value = this.line.Nums[index];
      const prevValue = this.line.Nums[index - 1];
      if (prevValue <= 0 && value > 0) {
        this.Trader.Buy(frame);
      }
      if (prevValue >= 0 && value < 0) {
        this.Trader.Sell(frame);
      }
    }
  }
}
