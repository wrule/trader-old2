import BTCData from './data/coinmarketcap/btc.json';
import { Load } from './data/coinmarketcap';
import moment, { normalizeUnits } from 'moment';
import { nums } from '@wrule/nums';
import { Cross2Line } from './strategy/Cross2Line';
import { Trader } from './trader';
import { Cross2LineFinder } from './finder/Cross2LineFinder';
import { Bill } from './bill';

const frames = Load(BTCData);
const prices = nums(frames.map((frame) => frame.price));
const lines = Array(200).fill(0).map((item, index) => prices.MA(index));
const trader = new Trader(100, 0.998, 0.998);
const finder = new Cross2LineFinder(trader, frames, lines);
const k = finder.Find();
console.log(k.map((item) => [item.Id, item.TotalProfitRate, item.WinRate]));


// const ma8 = prices.MA(1);
// const ma44 = prices.MA(2);
// const trader = new Trader(100, 0.998, 0.998);
// const st = new Cross2Line(trader, ma8, ma44);
// st.Backtesting(frames);
// trader.Bill.LogSummary();

