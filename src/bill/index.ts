import moment from "moment";
import { IFrame } from "../frame";
import { Trader } from "../trader";
import 'colors';
import { nums } from "@wrule/nums";

/**
 * 账单类
 */
export
class Bill {
  public constructor(
    private billItems: BillItem[] = [],
    private id = '',
  ) { }

  private buyTrade!: ITrade;
  private sellTrade!: ITrade;

  public get Id() {
    return this.id;
  }

  /**
   * 是否盈利
   */
  public get IsProfit() {
    return this.TotalProfit > 0;
  }

  /**
   * 交易次数（账单长度）
   */
  public get Length() {
    return this.billItems.length;
  }

  /**
   * 交易天数
   */
  public get TradingDays() {
    const startTime = moment(this.First?.BuyTrade.time || 0);
    const endTime = moment(this.Last?.SellTrade.time || 0);
    return endTime.diff(startTime, 'day', true);
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

  public get ProfitBill() {
    return new Bill(this.billItems.filter((item) => item.IsProfit), this.id + '-profit_items');
  }

  public get LossBill() {
    return new Bill(this.billItems.filter((item) => !item.IsProfit), this.id + '-loss_items');
  }

  public Slice(start: number, end: number) {
    return new Bill(this.billItems.slice(start, end), `${this.id}-${start}_${end - 1}_items`);
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
    const holdSellFunds = startBuyAssets * (endSellFunds / (endSellAssets || 1));
    return holdSellFunds - this.StartFunds;
  }

  /**
   * 持有是否盈利
   */
  public get IsHoldProfit() {
    return this.HoldProfit > 0;
  }

  /**
   * 持有盈利率
   */
  public get HoldProfitRate() {
    return this.HoldProfit / (this.StartFunds || 1) * 100;
  }

  /**
   * 账单盈利是否高于持有盈利
   */
  public get IsBetter() {
    return this.TotalProfit > this.HoldProfit;
  }

  /**
   * 账单盈利率优于持有盈利率的百分点
   */
  public get BetterRateDiff() {
    return this.TotalProfitRate - this.HoldProfitRate;
  }

  /**
   * 盈利统计
   */
  public get ProfitStats() {
    const profitNums = nums(this.billItems.map((item) => item.Profit));
    return {
      min: profitNums.min(),
      avg: profitNums.avg(),
      max: profitNums.max(),
      var: profitNums.variance(),
      std: profitNums.standardDeviation(),
    };
  }

  /**
   * 盈利率统计
   */
  public get ProfitRateStats() {
    const profitRateNums = nums(this.billItems.map((item) => item.ProfitRate));
    return {
      min: profitRateNums.min(),
      avg: profitRateNums.avg(),
      max: profitRateNums.max(),
      var: profitRateNums.variance(),
      std: profitRateNums.standardDeviation(),
    };
  }

  /**
   * 持仓天数统计
   */
  public get HoldingDaysStats() {
    const holdingDaysNums = nums(this.billItems.map((item) => item.HoldingDays));
    return {
      min: holdingDaysNums.min(),
      avg: holdingDaysNums.avg(),
      max: holdingDaysNums.max(),
      var: holdingDaysNums.variance(),
      std: holdingDaysNums.standardDeviation(),
    };
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

  /**
   * 获取子账单
   */
  public SubBills() {
    const result: Bill[] = [];
    let start = 0;
    for (let index = 1; index <= this.billItems.length; ++index) {
      const item = this.billItems[index];
      const prevItem = this.billItems[index - 1];
      if (index === this.billItems.length || item.IsProfit !== prevItem.IsProfit) {
        result.push(this.Slice(start, index));
        start = index;
      }
    }
    return result;
  }

  /**
   * 获取盈利子账单
   * @returns 盈利子账单
   */
  public ProfitSubBills() {
    return this.SubBills().filter((bill) => bill.IsProfit);
  }

  /**
   * 获取亏损子账单
   * @returns 亏损子账单
   */
  public LossSubBills() {
    return this.SubBills().filter((bill) => !bill.IsProfit);
  }

  /**
   * 获取连续盈利子账单
   * @returns 连续盈利子账单
   */
  public SerialProfitSubBills() {
    return this.ProfitSubBills().filter((bill) => bill.Length > 1);
  }

  /**
   * 获取连续亏损子账单
   * @returns 连续亏损子账单
   */
  public SerialLossSubBills() {
    return this.LossSubBills().filter((bill) => bill.Length > 1);
  }

  public LogMeta() {
    console.log(
      '账单Id',
      this.Id.bgBlue,
      '初始资金',
      this.StartFunds.toFixed(4).yellow,
      '结束资金',
      this.EndFunds.toFixed(4).yellow,
    );
    console.log(
      '交易次数',
      this.Length,
      '胜率',
      `${this.WinRate.toFixed(4)}%`.yellow,
      '盈利次数',
      this.ProfitNum.toString().yellow,
      '亏损次数',
      this.LossNum.toString().yellow,
    );
    console.log(
      '账单结果',
      this.IsProfit ? '盈利'.bgGreen : '亏损'.bgRed,
      '盈利',
      `${this.IsProfit ? '+' : ''}${this.TotalProfit.toFixed(4)}`[this.IsProfit ? 'green' : 'red'],
      '盈利率',
      `${this.IsProfit ? '+' : ''}${this.TotalProfitRate.toFixed(4)}%`[this.IsProfit ? 'green' : 'red'],
    );
    console.log(
      '持有对比',
      this.IsBetter ? '胜过'.bgGreen : '不及'.bgRed,
      '持有盈利',
      `${this.IsHoldProfit ? '+' : ''}${this.HoldProfit.toFixed(4)}`[this.IsHoldProfit ? 'green' : 'red'],
      '持有盈利率',
      `${this.IsHoldProfit ? '+' : ''}${this.HoldProfitRate.toFixed(4)}%`[this.IsHoldProfit ? 'green' : 'red'],
      '百分点差',
      `${this.IsBetter ? '+' : ''}${this.BetterRateDiff.toFixed(4)}%`[this.IsBetter ? 'green' : 'red'],
    );
    // 单次 最小 平均 最大 方差 标准差 盈利
    // 单次 最小 平均 最大 方差 标准差 亏损
    // 连续最大亏损 次数 总亏损 最小 平均 最大 方差 标准差
    // 连续最大盈利 次数 总盈利 最小 平均 最大 方差 标准差
    // 年化 月化 日化 收益
  }

  public LogSummary() {
    console.log(
      this.Id.bgBlue,
      '总盈利',
      this.TotalProfitRate.toFixed(4).concat('%').yellow,
      '交易次数',
      this.Length,
      '持仓天数',
      '单次盈利率',
      '最小',
      this.ProfitRateStats.min.toFixed(4).concat('%').yellow,
      '平均',
      this.ProfitRateStats.avg.toFixed(4).concat('%').yellow,
      '最大',
      this.ProfitRateStats.max.toFixed(4).concat('%').yellow,
      '标准差',
      this.ProfitRateStats.std.toFixed(4).concat('%').yellow,
    );
  }

  public LogX() {
    this.LogSummary();
    this.ProfitBill.LogSummary();
    this.LossBill.LogSummary();
  }

  public Log() {
    this.LogMeta();
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
