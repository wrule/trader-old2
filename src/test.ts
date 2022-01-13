import BTCData from './data/coinmarketcap/btc.json';
import { Load } from './data/coinmarketcap';
import moment, { normalizeUnits } from 'moment';
import { Nums, nums } from '@wrule/nums';
import { Cross2Line } from './strategy/Cross2Line';
import { Trader } from './trader';
import { Cross2LineFinder } from './finder/Cross2LineFinder';
import { Bill } from './bill';
import { BreakZero } from './strategy/BreakZero';

const trader = new Trader(100, 0.998, 0.998);
const frames = Load(BTCData);
const prices = nums(frames.map((frame) => frame.price));
const fastLine = prices.MA(8);
const slowLine = prices.MA(44);
const strategy = new Cross2Line(trader, fastLine, slowLine);
const bill = strategy.Backtesting(frames);
bill.SetId('鸡毛策略');
bill.LogMeta();
