export interface CoinDetailsModel {
  id: string,
  name: string,
  symbol: string,
  market_cap_rank: number,
  thumb: string,
  market_data: MarketDataModel,
  links: LinksModel,
}

interface MarketDataModel {
  current_price: number,
  price_change_percentage_24h: number,
}

interface LinksModel {
  homepage: string[],
  twitter_screen_name: string,
  facebook_username: string,
  repos_url: string[],
}
