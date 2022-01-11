import { IFrame } from "../frame";

export
class Trader {
  public constructor(
    private initFunds = 1,
    private buyFee = 0.999,
    private sellFee = 0.999,
  ) {
    this.funds = this.initFunds;
  }

  private funds = 0;
  private assets = 0;

  /**
   * 是否持有资产
   */
  public get Holding() {
    return this.assets > 0;
  }

  public Buy(frame: IFrame) {
    if (!this.Holding) {
      this.assets = this.funds / frame.price * this.buyFee;
      this.funds = 0;
    }
  }

  public Sell(frame: IFrame) {
    if (this.Holding) {
      this.funds = this.assets * frame.price * this.sellFee;
      this.assets = 0;
    }
  }
}
