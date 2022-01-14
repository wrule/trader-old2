import BTCData from './data/coinmarketcap/btc.json';
import { Load } from './data/coinmarketcap';
import { nums } from '@wrule/nums';
import { Cross2Line } from './strategy/Cross2Line';
import { Trader } from './trader';
import { Cross2LineFinder } from './finder/Cross2LineFinder';

const trader = new Trader(100, 0.998, 0.998);
const frames = Load(BTCData);
const prices = nums(frames.map((frame) => frame.price));
const lines = Array(400).fill(0).map((item, index) => prices.MA(index));
const finder = new Cross2LineFinder(trader, frames, lines);
const bills = finder.Find();
bills.forEach((bill) => {
  bill.LogSummary();
});
