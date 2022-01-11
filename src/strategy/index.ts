import { IFrame } from '../frame';
import { Trader } from '../trader';

export
abstract class Strategy {
  public constructor(
    private trader: Trader,
  ) { }

  private index: number = 0;
  private frames: IFrame[] = [];

  protected get Index() {
    return this.index;
  }

  protected get Frame() {
    return this.frames[this.index];
  }

  protected get Trader() {
    return this.trader;
  }

  protected abstract Watch(frame?: IFrame, index?: number): void;

  public Backtesting(frames: IFrame[]) {
    this.frames = frames;
    this.frames.forEach((frame, index) => {
      this.index = index;
      this.Watch(this.Frame, this.Index);
    });
  }
}
