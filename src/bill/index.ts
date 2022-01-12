import moment from "moment";
import { IFrame } from "../frame";
import { Trader } from "../trader";
import 'colors';

export
class Bill {
  public constructor(
    private id = '',
  ) { }

  private billItems: BillItem[] = [];
  private buyTrade!: ITrade;
  private sellTrade!: ITrade;

  public get Id() {
    return this.id;
  }

  /**
   * 账单长度（交易次数）
   */
  public get Length() {
    return this.billItems.length;
  }

  /**
   * 账单列表
   */
  public get BillItems() {
    return this.billItems.slice(0);
  }

  public get First() {
    return this.billItems[0];
  }

  public get Last() {
    return this.billItems[this.billItems.length - 1];
  }

  /**
   * 胜率
   */
  public get WinRate() {
    return (this.billItems.filter((item) => item.IsProfit).length / this.Length) * 100;
  }

  /**
   * 总盈利
   */
  public get TotalProfit() {
    const startBuyFunds = this.billItems[0]?.BuyTrade?.funds || 0;
    const endSellFunds = this.billItems[this.billItems.length - 1]?.SellTrade?.funds || 0;
    return endSellFunds - startBuyFunds;
  }

  public get HoldProfit() {
    const startPrice = this.First?.BuyTrade?.price || 0;
    const endPrice = this.Last?.SellTrade?.price || 0;
    return endPrice - startPrice;
  }

  public get HoldProfitRate() {
    const startPrice = this.First?.BuyTrade?.price || 0;
    if (startPrice !== 0) {
      return this.HoldProfit / startPrice * 100;
    }
    return 0;
  }

  public get IsBetter() {
    return this.TotalProfitRate > this.HoldProfitRate;
  }

  public get BetterRate() {
    return this.TotalProfitRate / this.HoldProfitRate * 100;
  }

  public get IsProfit() {
    return this.TotalProfit > 0;
  }

  /**
   * 总盈利率
   */
  public get TotalProfitRate() {
    const startBuyFunds = this.billItems[0]?.BuyTrade?.funds || 0;
    if (startBuyFunds !== 0) {
      return this.TotalProfit / startBuyFunds * 100; 
    }
    return 0;
  }

  private recording = false;

  public SetId(id: string) {
    this.id = id;
  }

  public RecordBuy(
    frame: IFrame,
    trader: Trader,
  ) {
    if (!this.recording) {
      this.buyTrade = {
        time: frame.time,
        price: frame.price,
        funds: trader.Funds,
        assets: trader.Assets,
      };
      this.recording = true;
    }
  }

  public RecordSell(
    frame: IFrame,
    trader: Trader,
  ) {
    if (this.recording) {
      this.sellTrade = {
        time: frame.time,
        price: frame.price,
        funds: trader.Funds,
        assets: trader.Assets,
      };
      this.billItems.push(new BillItem(this.buyTrade, this.sellTrade));
      this.recording = false;
    }
  }

  public LogSummary() {
    // 盈利次数，亏损次数
    console.log(
      '交易次数',
      this.Length,
      '胜率',
      `${this.WinRate.toFixed(4)}%`.yellow,
    );
    console.log(
      '账单结果',
      this.IsProfit ? '盈利'.bgGreen : '亏损'.bgRed,
      '盈利率',
      `${this.TotalProfitRate.toFixed(4)}%`[this.IsProfit ? 'green' : 'red'],
    );
    console.log(
      '持有对比',
      this.IsBetter ? '胜过'.bgGreen : '不及'.bgRed,
      '对比指数',
      `${this.BetterRate.toFixed(4)}%`[this.IsBetter ? 'green' : 'red'],
    );
    // 单次 最小 平均 最大 盈利
    // 单次 最小 平均 最大 亏损
    // 连续最大亏损 次数 总亏损 最小 平均 最大
    // 连续最大盈利 次数 总盈利 最小 平均 最大
    // 年化 月化 收益
  }

  public Log() {
    this.billItems.forEach((item) => {
      console.log();
      item.Log();
    });
  }
}

class BillItem {
  public constructor(
    private buyTrade: ITrade,
    private sellTrade: ITrade,
  ) { }

  public get BuyTrade(): ITrade {
    return { ...this.buyTrade };
  }

  public get SellTrade(): ITrade {
    return { ...this.sellTrade };
  }

  public get IsProfit() {
    return this.sellTrade.funds > this.buyTrade.funds;
  }

  public get Profit() {
    return this.sellTrade.funds - this.buyTrade.funds;
  }

  public get ProfitRate() {
    return (this.Profit / this.buyTrade.funds) * 100;
  }

  public Log() {
    console.log(
      '交易结果',
      this.IsProfit ? '盈利'.bgGreen : '亏损'.bgRed,
      '盈利率',
      `${this.ProfitRate.toFixed(4)}%`[this.IsProfit ? 'green' : 'red'],
    );
    console.log(
      `[${moment(this.buyTrade.time).format('YYYY-MM-DD HH:mm:ss')}]`,
      '买入'.bgGreen,
      '放出资金',
      this.buyTrade.funds.toFixed(4).yellow,
      '买入资产',
      this.buyTrade.assets.toFixed(4).yellow,
    );
    console.log(
      `[${moment(this.sellTrade.time).format('YYYY-MM-DD HH:mm:ss')}]`,
      '卖出'.bgBlue,
      '卖出资产',
      this.sellTrade.assets.toFixed(4).yellow,
      '收回资金',
      this.sellTrade.funds.toFixed(4).yellow,
    );
  }
}

interface ITrade {
  time: number;
  price: number;
  funds: number;
  assets: number;
}
