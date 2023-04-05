export interface CoinDetailsModel {
  id: string,
  name: string,
  symbol: string,
  description: any;
  market_cap_rank: number,
  image: ImageModel,
  market_data: MarketDataModel,
  categories: string[],
  links: LinksModel,
}

interface MarketDataModel {
  current_price: any,
  price_change_percentage_24h: number,
  high_24h: any,
  low_24h: any,
}

interface LinksModel {
  homepage: string[],
  twitter_screen_name: string,
  facebook_username: string,
  repos_url: ReposUrlModel,
}

interface ImageModel {
  thumb: string,
}

interface ReposUrlModel {
  github: string[],
}
