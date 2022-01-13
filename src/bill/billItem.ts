import moment from 'moment';
import { ITrade } from './trade';
import { niceProfit, niceProfitRate } from './utils';

/**
 * 账目类
 */
export
class BillItem {
  /**
   * 构造函数
   * @param buyTrade 买入交易
   * @param sellTrade 卖出交易
   */
  public constructor(
    private buyTrade: ITrade,
    private sellTrade: ITrade,
  ) { }

  /**
   * 买入交易
   */
  public get BuyTrade(): ITrade {
    return { ...this.buyTrade };
  }

  /**
   * 卖出交易
   */
  public get SellTrade(): ITrade {
    return { ...this.sellTrade };
  }

  /**
   * 账目是否盈利
   */
  public get IsProfit() {
    return this.sellTrade.funds > this.buyTrade.funds;
  }

  /**
   * 账目盈利数额
   */
  public get Profit() {
    return this.sellTrade.funds - this.buyTrade.funds;
  }

  /**
   * 账目盈利率（百分比）
   */
  public get ProfitRate() {
    return (this.Profit / (this.buyTrade.funds || 1)) * 100;
  }

  /**
   * 持仓天数
   */
  public get HoldingDays() {
    const startTime = moment(this.buyTrade.time);
    const endTime = moment(this.sellTrade.time);
    return endTime.diff(startTime, 'day', true);
  }

  /**
   * 输出账目信息
   */
  public Log() {
    console.log(
      '交易结果',
      this.IsProfit ? '盈利'.bgGreen : '亏损'.bgRed,
      '盈利率',
      niceProfitRate(this.ProfitRate),
      '盈利',
      niceProfit(this.Profit),
      '持仓天数',
      this.HoldingDays.toFixed(4).yellow,
    );
    console.log(
      `[${moment(this.buyTrade.time).format('YYYY-MM-DD HH:mm:ss')}]`,
      '买入'.bgCyan,
      '投入资金',
      this.buyTrade.funds.toFixed(4).yellow,
      '买入资产',
      this.buyTrade.assets.toFixed(4).yellow,
      '市场价格',
      this.buyTrade.price.toFixed(4).yellow,
    );
    console.log(
      `[${moment(this.sellTrade.time).format('YYYY-MM-DD HH:mm:ss')}]`,
      '卖出'.bgBlue,
      '收回资金',
      this.sellTrade.funds.toFixed(4).yellow,
      '卖出资产',
      this.sellTrade.assets.toFixed(4).yellow,
      '市场价格',
      this.sellTrade.price.toFixed(4).yellow,
    );
  }
}
