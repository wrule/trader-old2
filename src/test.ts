import BTCData from './data/coinmarketcap/btc.json';
import { Load } from './data/coinmarketcap';
import moment from 'moment';

const a = moment(new Date()).endOf('day');
const b = moment('2022-01-10 23:59:59').startOf('day');
const r = a.diff(b, 'day');
console.log(r);

const k = Load(BTCData);
console.log(k.length);
