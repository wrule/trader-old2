
/**
 * 交易结构
 */
export
interface ITrade {
  /**
   * 交易时间
   */
  time: number;
  /**
   * 市场价格
   */
  price: number;
  /**
   * 交易资金数量
   */
  funds: number;
  /**
   * 交易资产数量
   */
  assets: number;
}
