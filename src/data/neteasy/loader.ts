import Papa from 'papaparse';
import moment from 'moment';
import { IFrame } from '../../frame';

export
function Load(csvText: string): IFrame[] {
  const jsonObject = Papa.parse(csvText.trim(), {
    header: true,
    dynamicTyping: true,
  });
  return jsonObject.data.map((item: any) => ({
    time: moment(new Date(item['日期'])).valueOf(),
    price: item['收盘价'],
  }));
}
