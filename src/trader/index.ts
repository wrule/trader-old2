import { Bill } from '../bill';
import { IFrame } from '../frame';

/**
 * 交易者类
 */
export
class Trader {
  /**
   * 构造函数
   * @param initFunds 初始资金
   * @param buyFee 购买费率
   * @param sellFee 出售费率
   * @param shortFee 做空手续费
   * @param shortDayFee 做空每日费用
   */
  public constructor(
    private initFunds = 100,
    private buyFee = 0.998,
    private sellFee = 0.998,
    private shortFee = 0.9996,
    private shortDayFee = 0.9996,
  ) {
    this.funds = this.initFunds;
  }

  private funds = 0;
  private assets = 0;
  private bill = new Bill();

  /**
   * 当前资金量
   */
  public get Funds() {
    return this.funds;
  }

  /**
   * 当前资产量
   */
  public get Assets() {
    return this.assets;
  }

  /**
   * 交易账单
   */
  public get Bill() {
    return this.bill;
  }

  /**
   * 是否持有资产
   */
  public get Holding() {
    return this.assets > 0;
  }

  /**
   * 购买资产
   * @param frame 帧
   */
  public Buy(frame: IFrame) {
    if (!this.Holding) {
      this.assets = this.funds / frame.price * this.buyFee;
      this.bill.RecordBuy(frame, this);
      this.funds = 0;
    }
  }

  /**
   * 出售资产
   * @param frame 帧
   */
  public Sell(frame: IFrame) {
    if (this.Holding) {
      this.funds = this.assets * frame.price * this.sellFee;
      this.bill.RecordSell(frame, this);
      this.assets = 0;
    }
  }

  private shortAssets = 0;
  private shortFunds = 0;

  /**
   * 是否持有做空资产
   */
  public get ShortHolding() {
    return this.shortAssets > 0;
  }

  /**
   * 做空
   * @param frame 帧
   */
  public Short(frame: IFrame) {
    if (!this.Holding && !this.ShortHolding) {
      this.shortAssets = this.funds / frame.price;
      this.shortFunds = this.funds * this.shortFee;
    }
  }

  /**
   * 做空平仓
   * @param frame 帧
   */
  public CloseShort(frame: IFrame) {
    if (this.ShortHolding) {
      const closeFunds = this.shortAssets * frame.price / this.shortFee;
      this.shortFunds -= closeFunds;
      this.funds += this.shortFunds;
      this.shortFunds = 0;
      this.shortAssets = 0;
    }
  }

  /**
   * 重置交易者
   */
  public Reset() {
    this.funds = this.initFunds;
    this.assets = 0;
    this.bill = new Bill();
  }
}
