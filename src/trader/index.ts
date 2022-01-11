import { Bill } from "../bill";
import { IFrame } from "../frame";

export
class Trader {
  public constructor(
    private initFunds = 1,
    private buyFee = 0.998,
    private sellFee = 0.998,
  ) {
    this.funds = this.initFunds;
  }

  private funds = 0;
  private assets = 0;

  private bill = new Bill();

  public get Funds() {
    return this.funds;
  }

  public get Assets() {
    return this.assets;
  }

  public get Bill() {
    return this.bill;
  }

  /**
   * 是否持有资产
   */
  public get Holding() {
    return this.assets > 0;
  }

  public Buy(frame: IFrame) {
    if (!this.Holding) {
      this.assets = this.funds / frame.price * this.buyFee;
      this.bill.RecordBuy(frame, this);
      this.funds = 0;
    }
  }

  public Sell(frame: IFrame) {
    if (this.Holding) {
      this.funds = this.assets * frame.price * this.sellFee;
      this.bill.RecordSell(frame, this);
      this.assets = 0;
    }
  }
}
