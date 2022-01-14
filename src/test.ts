import BTCData from './data/coinmarketcap/btc.json';
import { Load } from './data/coinmarketcap';
import { nums } from '@wrule/nums';
import { Cross2Line } from './strategy/Cross2Line';
import { Trader } from './trader';
import { Cross2LineFinder } from './finder/Cross2LineFinder';
import { Bill } from './bill';

const trader = new Trader(100, 0.998, 0.998);
const frames = Load(BTCData);
const prices = nums(frames.map((frame) => frame.price));
const lines = Array(400).fill(0).map((item, index) => prices.MA(index));
const finder = new Cross2LineFinder(trader, frames, lines);
const bills = finder.Find({
  filter: ((bill: Bill) => bill.IsProfit && bill.IsBetter && bill.WinRate >= 40 && bill.Length > 30),
  sorter: (bill1: Bill, bill2: Bill) => bill2.WinRate - bill1.WinRate,
});
bills.forEach((bill) => {
  bill.LogSummary();
});
