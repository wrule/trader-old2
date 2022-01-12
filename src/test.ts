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
const lines: Nums[] = [];

for (let fast = 1; fast < 200; ++fast) {
  console.log(fast);
  for (let slow = fast + 1; slow <= 200; ++slow) {
    for (let size = 1; size <= 200; ++size) {
      const { MACD } = prices.MACD(fast, slow, size);
      lines.push(MACD);
    }
  }
}
