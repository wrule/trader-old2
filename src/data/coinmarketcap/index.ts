import moment from 'moment';
import { IFrame } from '../../frame';

export
function Load(data: any): IFrame[] {
  const points = Object.entries(data?.data?.points || { })
    .map(([key, value]) => ({
      time: Number(key) * 1000,
      price: ((value as any)?.v || [])[0] as number,
    }));
  return points;
}
