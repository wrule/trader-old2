import BTCData from './data/coinmarketcap/btc.json';
import { Load } from './data/coinmarketcap';
import moment, { normalizeUnits } from 'moment';
import { nums } from '@wrule/nums';

const k = Load(BTCData);
console.log(k.length);

const a = nums(k.map((item) => item.price));
for (let i = 0; i < 200; ++i) {
  console.log(i);
  for (let j = 0; j < 200; ++j) {
    for (let k = 0; k < 200; ++k) {
      const kk = a.MACD(i, j, k);
    }
  }
}
