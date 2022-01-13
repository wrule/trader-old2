import 'colors';

export
function niceProfit(num: number) {
  return `${num > 0 ? '+' : ''}${num.toFixed(4)}`[num > 0 ? 'green' : 'red'];
}

export
function niceProfitRate(num: number) {
  return `${num > 0 ? '+' : ''}${num.toFixed(4)}%`[num > 0 ? 'green' : 'red'];
}
