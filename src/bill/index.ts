import moment from "moment";
import { IFrame } from "../frame";
import { Trader } from "../trader";
import 'colors';

/**
 * 账单类
 */
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
   * 交易次数（账单长度）
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

  /**
   * 第一个账目
   */
  public get First() {
    return this.billItems[0];
  }

  /**
   * 最后一个账目
   */
  public get Last() {
    return this.billItems[this.billItems.length - 1];
  }

  /**
   * 盈利次数
   */
  public get ProfitNum() {
    return this.billItems.filter((item) => item.IsProfit).length;
  }

  /**
   * 亏损次数
   */
  public get LossNum() {
    return this.billItems.filter((item) => !item.IsProfit).length;
  }

  /**
   * 胜率
   */
  public get WinRate() {
    return this.ProfitNum / (this.Length || 1) * 100;
  }

  /**
   * 初始资金
   */
  public get StartFunds() {
    return this.First?.BuyTrade?.funds || 0;
  }

  /**
   * 结束资金
   */
  public get EndFunds() {
    return this.Last?.SellTrade?.funds || 0;
  }

  /**
   * 总盈利
   */
  public get TotalProfit() {
    return this.EndFunds - this.StartFunds;
  }

  /**
   * 总盈利率
   */
  public get TotalProfitRate() {
    return this.TotalProfit / (this.StartFunds || 1) * 100;
  }

  /**
   * 持有盈利
   */
  public get HoldProfit() {
    const startBuyAssets = this.First?.BuyTrade?.assets || 0;
    const endSellAssets = this.Last?.SellTrade?.assets || 0;
    const endSellFunds = this.Last?.SellTrade?.funds || 0;
    const holdSellFunds = startBuyAssets / (endSellAssets / endSellFunds);
    return holdSellFunds - this.StartFunds;
  }

  /**
   * 持有盈利率
   */
  public get HoldProfitRate() {
    return this.HoldProfit / (this.StartFunds || 1) * 100;
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
      `${this.IsProfit ? '+' : ''}${this.ProfitRate.toFixed(4)}%`[this.IsProfit ? 'green' : 'red'],
      '持仓天数',
      this.HoldingDays.toFixed(4).yellow,
    );
    console.log(
      `[${moment(this.buyTrade.time).format('YYYY-MM-DD HH:mm:ss')}]`,
      '买入'.bgCyan,
      '使用资金',
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

/**
 * 交易结构
 */
export
interface ITrade {
  time: number;
  price: number;
  funds: number;
  assets: number;
}
