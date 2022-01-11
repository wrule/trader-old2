import moment from 'moment';
import { IFrame } from '../../frame';

export
function Load(data: any): IFrame[] {
  const points = Object.entries(data?.data?.points || { })
    .map(([key, value]) => ({
      time: Number(key) * 1000,
      price: ((value as any)?.v || [])[0] as number,
    }));
  const result: IFrame[] = [];
  points.forEach((item, index) => {
    if (item.time == null || isNaN(item.time)) {
      throw new Error(`index: ${index} time非法`);
    }
    if (item.price == null || isNaN(item.price)) {
      throw new Error(`index: ${index} price非法`);
    }
    if (result.length > 0) {
      const time = moment(item.time);
      const prevTime = moment(result[result.length - 1].time);
      const dayDiff = time.endOf('day').diff(prevTime.startOf('day'), 'day');
      if (dayDiff === 0) {
        result.pop();
      } else if (dayDiff !== 1) {
        throw new Error(`index: ${index} time错乱`);
      }
    }
    result.push(item);
  });
  return result;
}
