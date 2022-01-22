import BTCData from './data/coinmarketcap/ada.json';
import { Load } from './data/coinmarketcap';
import { Trader } from './trader';
import { MACDFinder } from './finder/MACDFinder';
import { MACDFinder2 } from './finder/MACDFinder2';
import { nums } from '@wrule/nums';
import { Cross2Line } from './strategy/Cross2Line';
import { Cross2LineFinder } from './finder/Cross2LineFinder';

const trader = new Trader(100, 0.998, 0.998);
const frames = Load(BTCData);
const prices = nums(frames.map((frame) => frame.price));
const lines = Array(200).fill(0).map((num, index) => prices.MA(index));
const finder = new Cross2LineFinder(trader, frames, lines);
const bills = finder.Find({

});
bills.forEach((bill) => {
  bill.LogSummary();
});
