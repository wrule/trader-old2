import BTCData from './data/coinmarketcap/eth.json';
import { Load } from './data/coinmarketcap';
import moment, { normalizeUnits } from 'moment';
import { nums } from '@wrule/nums';
import { Cross2Line } from './strategy/Cross2Line';
import { Trader } from './trader';
import { Cross2LineFinder } from './finder/Cross2LineFinder';
import { Bill } from './bill';
import { BreakZero } from './strategy/BreakZero';

const trader = new Trader(100, 0.998, 0.998);
const frames = Load(BTCData);
const prices = nums(frames.map((frame) => frame.price));
const { MACD } = prices.MACD(12, 26, 9);
const strategy = new BreakZero(trader, MACD);
const bill = strategy.Backtesting(frames);
bill.LogSummary();
