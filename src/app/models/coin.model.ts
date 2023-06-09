import { ChartOptionsModel } from "./chartOptions.model";

export interface CoinModel {
  id: number,
  market_cap_rank: number,
  image: string,
  name: string,
  symbol: string,
  current_price: number,
  price_change_percentage_1h_in_currency: number,
  price_change_percentage_24h: number,
  price_change_percentage_14d_in_currency: number,
  total_volume: number,
  sparkline_in_7d: Sparkline7dModel,
  isFavorite?: boolean,
  chartOptions?: ChartOptionsModel,
}

interface Sparkline7dModel {
  price: number[];
}
