import BTCData from './data/coinmarketcap/btc.json';
import { Load } from './data/coinmarketcap';
import moment, { normalizeUnits } from 'moment';
import { nums } from '@wrule/nums';
import { Cross2Line } from './strategy/Cross2Line';
import { Trader } from './trader';

const frames = Load(BTCData);
const prices = nums(frames.map((frame) => frame.price));
const ma8 = prices.MA(1);
const ma44 = prices.MA(2);
const trader = new Trader(100, 0.998, 0.998);
const st = new Cross2Line(trader, ma8, ma44);
st.Backtesting(frames);
// trader.Bill.Log();
trader.Bill.LogSummary();

