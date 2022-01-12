import { IFrame } from '../frame';
import { Trader } from '../trader';

/**
 * 策略抽象类
 */
export
abstract class Strategy {
  public constructor(
    private trader: Trader,
  ) { }

  private index: number = 0;
  private frames: IFrame[] = [];

  /**
   * 当前索引
   */
  protected get Index() {
    return this.index;
  }

  /**
   * 当前数据帧
   */
  protected get Frame() {
    return this.frames[this.index];
  }

  /**
   * 当前交易者
   */
  protected get Trader() {
    return this.trader;
  }

  /**
   * 询价方法（子类实现）
   * @param frame 帧
   * @param index 索引
   */
  protected abstract watch(frame: IFrame, index: number): void;

  /**
   * 历史回测
   * @param frames 数据帧列表
   */
  public Backtesting(frames: IFrame[]) {
    this.frames = frames;
    this.trader.Reset();
    this.frames.forEach((frame, index) => {
      this.index = index;
      this.watch(frame, index);
      if (index === this.frames.length - 1) {
        this.Trader.Sell(frame);
      }
    });
    return this.trader.Bill;
  }
}
