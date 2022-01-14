import BTCData from './data/coinmarketcap/btc.json';
import { Load } from './data/coinmarketcap';
import { Trader } from './trader';
import { MACDFinder } from './finder/MACDFinder';
import { MACDFinder2 } from './finder/MACDFinder2';
import { nums } from '@wrule/nums';
import { Cross2Line } from './strategy/Cross2Line';

const trader = new Trader(100, 0.998, 0.998);
const frames = Load(BTCData);
const prices = nums(frames.map((frame) => frame.price));
const maFast = prices.MA(8);
const maSlow = prices.MA(44);
const strategy = new Cross2Line(trader, maFast, maSlow);
const bill = strategy.Backtesting(frames);
// bill.LogAll();
console.log(bill.BillItems.map((item) => item.ProfitRate));
