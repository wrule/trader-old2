import BTCData from './data/coinmarketcap/btc.json';
import { Load } from './data/coinmarketcap';
import moment from 'moment';

const k = Load(BTCData);
console.log(k.length);
