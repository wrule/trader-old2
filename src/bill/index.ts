import { IFrame } from "../frame";
import { Trader } from "../trader";

export
class Bill {
  public constructor() { }

  private billItems: BillItem[] = [];
  private buyTrade!: ITrade;
  private sellTrade!: ITrade;

  public RecordBuy(
    frame: IFrame,
    trader: Trader,
  ) {
    this.buyTrade = {
      time: frame.time,
      price: frame.price,
      funds: trader.Funds,
      assets: trader.Assets,
    };
  }

  public RecordSell(
    frame: IFrame,
    trader: Trader,
  ) {
    this.sellTrade = {
      time: frame.time,
      price: frame.price,
      funds: trader.Funds,
      assets: trader.Assets,
    };
    this.billItems.push(new BillItem(this.buyTrade, this.sellTrade));
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
