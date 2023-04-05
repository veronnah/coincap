import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { CoinModel } from "../models/coin.model";
import { CoinDetailsModel } from "../models/coinDetails.model";
import { MarketDataModel } from "../models/marketData.model";

@Injectable({
  providedIn: 'root'
})
export class CoinsService {

  constructor(private http: HttpClient) {
  }

  public getCoinsList(pageNumber: number): Observable<CoinModel[]> {
    return this.http.get<CoinModel[]>(
      `${environment.apiUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${pageNumber}&sparkline=true&price_change_percentage=1h%2C%2024h%2C%207d%2C14d`)
      .pipe(map((result: CoinModel[]) => {
          return result.map((coin: CoinModel) => {
            return {
              id: coin.id,
              market_cap_rank: coin.market_cap_rank,
              image: coin.image,
              name: coin.name,
              symbol: coin.symbol,
              current_price: coin.current_price,
              price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency,
              price_change_percentage_24h: coin.price_change_percentage_24h,
              price_change_percentage_14d_in_currency: coin.price_change_percentage_14d_in_currency / 2,
              total_volume: coin.total_volume,
              sparkline_in_7d: coin.sparkline_in_7d,
            }
          });
        }
      ));
  }

  public getCoin(id: string): Observable<CoinDetailsModel> {
    return this.http.get<CoinDetailsModel>(`${environment.apiUrl}/coins/${id}`);
  }

  public getMarketData(coinId: string, days: string | undefined): Observable<MarketDataModel> {
    return this.http.get<MarketDataModel>(`${environment.apiUrl}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
  }
}
