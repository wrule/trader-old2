import BTCData from './data/coinmarketcap/btc.json';
import { Load } from './data/coinmarketcap';

const a = Load(BTCData);
console.log(a[0]);
