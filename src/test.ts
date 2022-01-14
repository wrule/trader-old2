import BTCData from './data/coinmarketcap/btc.json';
import { Load } from './data/coinmarketcap';
import { Trader } from './trader';
import { MACDFinder } from './finder/MACDFinder';

const trader = new Trader(100, 0.998, 0.998);
const frames = Load(BTCData);

const finder = new MACDFinder(trader, frames, 200, 200);
const bills = finder.Find();
bills.forEach((bill) => {
  bill.LogSummary();
});
