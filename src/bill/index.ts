import { IFrame } from "../frame";
import { Trader } from "../trader";

export
class Bill {
  public constructor() { }

  private billItems: BillItem[] = [];
  private buyTrade!: ITrade;
  private sellTrade!: ITrade;

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
}

interface ITrade {
  time: number;
  price: number;
  funds: number;
  assets: number;
}
